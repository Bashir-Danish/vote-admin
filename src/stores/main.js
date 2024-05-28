import { useMyFetch } from "@/utils/myFetch";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMainStore = defineStore("main", () => {
  const districts = ref([]);
  const provinces = ref([]);
  const offices = ref([]);
  const categories = ref([]);
  const settings = ref([]);
  const selectedSetting = ref(null);
  const defaultCat = ref(null);
  const defaultProvince = ref(null);
  const defaultDistrict = ref(null);
  const languages = ['دری', 'پشتو', 'انگلیسی']

  const selectedLanguage = ref(0)

  function setLang(lang) {
    if (!lang) {
      if (selectedLanguage.value > 1) selectedLanguage.value = 0
      else selectedLanguage.value++
      localStorage.setItem('lang', selectedLanguage.value)
      window.location.reload()
    } else {
      selectedLanguage.value = lang
      localStorage.setItem('lang', lang)
    }
  }

  const getLang = computed(() => languages[selectedLanguage.value])

  async function loadData() {
    try {
      districts.value = [];
      provinces.value = [];
      offices.value = [];
      categories.value = [];
      const { data: provinceRes } = await useMyFetch("province/all")
        .get()
        .json();
      const { data: districtRes } = await useMyFetch("district/all")
        .get()
        .json();
      const { data: officeRes } = await useMyFetch("office/all").get().json();
      const { data: catRes } = await useMyFetch("category/all").get().json();
      const { data: settingRes } = await useMyFetch("setting/all").get().json();
      provinces.value = [...provinceRes.value.provinces];
      districts.value = [...districtRes.value.districts];
      offices.value = [...officeRes.value.offices];
      categories.value = [...catRes.value.categories];
      settings.value = [...settingRes.value.settings];
      defaultCat.value = settings.value.find((e) => e.key == "defaultCat");
      handleCat();
      defaultProvince.value = settings.value.find((e) => e.key == "defaultProvince");
      handleProvince();
      defaultDistrict.value = settings.value.find((e) => e.key == "defaultDistrict");
      handleDistrict();
      settings.value = settings.value.filter((e) => !['defaultCat', 'defaultProvince', 'defaultDistrict'].includes(e.key))
    } catch (error) {
      console.log(error);
    }
  }

  // save updated setting
  async function saveSetting(callBack) {
    try {
      console.log(selectedSetting);
      const { _id, value } = selectedSetting.value
      const { data } = await useMyFetch("setting/" + _id)
        .put({ value })
        .json();
      settings.value = settings.value.map((s) =>
        s._id == data.value.setting._id ? data.value.setting : s
      );
    } catch (error) {
      console.log(error);
    }
    callBack();
  }

  async function setDefaults(payload) {
    try {
      console.log(payload);
      const { data } = await useMyFetch("setting/")
        .patch(payload)
        .json();
    } catch (error) {
      console.log(error);
    }
  }

  // add new Province
  async function addProvince(pName, pNamePs, pNameEn) {
    try {
      const { data } = await useMyFetch("province/add")
        .post({
          name: [pName, pNamePs, pNameEn],
        })
        .json();
      provinces.value = [...provinces.value, data.value.province];
    } catch (error) {
      console.log(error);
    }
  }
  // add new Province
  async function editProvince(id, pName, pNamePs, pNameEn) {
    try {
      const { data } = await useMyFetch(`province/${id}`)
        .put({
          name: [pName, pNamePs, pNameEn],
        })
        .json();
      provinces.value = provinces.value.map((p) =>
        p._id == data.value.province._id ? data.value.province : p
      );
    } catch (error) {
      console.log(error);
    }
  }

  // add new District
  async function addDistrict(dName,dNamePs,dNameEn, provinceId) {
    try {
      const { data } = await useMyFetch("district/add")
        .post({
          name: [dName,dNamePs,dNameEn],
          province: provinceId,
        })
        .json();
      // convert provinceId to province object
      const province = provinces.value.find(
        (province) => province._id == provinceId
      );
      data.value.district.province = province;

      districts.value = [...districts.value, data.value.district];
    } catch (error) {
      console.log(error);
    }
  }
  // add new District
  async function editDistrict(id, dName,dNamePs,dNameEn, provinceId) {
    try {
      const { data } = await useMyFetch(`district/${id}`)
        .put({
          name: [dName,dNamePs,dNameEn],
          province: provinceId,
        })
        .json();
        
      const province = provinces.value.find(
        (province) => province._id == provinceId
      );
      data.value.district.province = province;

      districts.value = districts.value.map((d) =>
        d._id == data.value.district._id ? data.value.district : d
      );
    } catch (error) {
      console.log(error);
    }
  }

  // add new Office
  async function addOffice(oName,oNamePs,oNameEn, provinceId, districtId) {
    try {
      let body = {
        name: [oName,oNamePs,oNameEn],
        province: provinceId,
        district: districtId,
      };
      const { data } = await useMyFetch("office/add").post(body).json();
      // convert provinceId, districtId to province, district object
      console.log(body, data.value);
      data.value.office.province = provinces.value.find(
        (province) => province._id == provinceId
      );
      data.value.office.district = districts.value.find(
        (district) => district._id == districtId
      );

      offices.value = [...offices.value, data.value.office];
    } catch (error) {
      console.log(error);
    }
  }
  
  async function editOffice(id, oName,oNamePs,oNameEn, provinceId, districtId) {
    try {
      let body = {
        name: [oName,oNamePs,oNameEn],
        province: provinceId,
        district: districtId,
      };
      const { data } = await useMyFetch(`office/${id}`).put(body).json();
      data.value.office.province = provinces.value.find(
        (province) => province._id == provinceId
      );
      data.value.office.district = districts.value.find(
        (district) => district._id == districtId
      );

      offices.value = offices.value.map((o) =>
        o._id == data.value.office._id ? data.value.office : o
      );
    } catch (error) {
      console.log(error);
    }
  }

  // add new Category
  async function addCategory(cat, catPs, catEn) {
    try {
      const { data } = await useMyFetch("category/add")
        .post({
          name: [cat, catPs, catEn],
        })
        .json();
      categories.value = [...categories.value, data.value.category];
    } catch (error) {
      console.log(error);
    }
  }
  
  async function editCategory(cat, catPs, catEn, id) {
    try {
      const { data } = await useMyFetch(`category/${id}`)
        .put({
          name: [cat, catPs, catEn],
        })
        .json();
      categories.value = categories.value.map((c) =>
        c._id == data.value.category._id ? data.value.category : c
      );
    } catch (error) {
      console.log(error);
    }
  }

  // delete Province
  async function deleteProvince(provinceId) {
    try {
      await useMyFetch(`province/${provinceId}`).delete().json();
      provinces.value = provinces.value.filter(
        (province) => province._id !== provinceId
      );
    } catch (error) {
      console.log(error);
    }
  }

  // delete District
  async function deleteDistrict(districtId) {
    try {
      await useMyFetch(`district/${districtId}`).delete().json();
      districts.value = districts.value.filter(
        (district) => district._id !== districtId
      );
    } catch (error) {
      console.log(error);
    }
  }

  // delete Office
  async function deleteOffice(officeId) {
    try {
      await useMyFetch(`office/${officeId}`).delete().json();
      offices.value = offices.value.filter((office) => office._id !== officeId);
    } catch (error) {
      console.log(error);
    }
  }

  // delete Category
  async function deleteCategory(categoryId) {
    try {
      await useMyFetch(`category/${categoryId}`).delete().json();
    } catch (error) {
      console.log(error);
    }
  }

  // list for title of settings
  const settingsTitle = {
    'pollHours': "انقضای نظرسنجی ها بعد از (روز)",
    'about': "صفحه درباره ما",
    'contact': "صفحه تماس با ما",
    'facebookKey': "لینک فیسبوک",
    'instagramKey': "لینک اینستاگرام",
    'twitterKey': "لینک تلگرام",
    'email': "ایمیل",
    "playStoreKey": "لینک پلی استور",
    "appStoreKey": "لینک آپ استور ایفون"
  };

  const handleCat = () => {
    const { value } = defaultCat.value;
    defaultCat.value = categories.value.find((e) => e._id == value);
  }
  const handleDistrict = () => {
    const { value } = defaultDistrict.value;
    defaultDistrict.value = districts.value.find((e) => e._id == value);
  }
  const handleProvince = () => {
    const { value } = defaultProvince.value;
    defaultProvince.value = provinces.value.find((e) => e._id == value);
  }

  return {
    loadData,
    setLang,
    getLang,
    addDistrict,
    addProvince,
    addOffice,
    addCategory,
    editCategory,
    editDistrict,
    editProvince,
    editOffice,
    provinces,
    offices,
    districts,
    categories,
    settings,
    deleteProvince,
    deleteDistrict,
    deleteOffice,
    deleteCategory,
    settingsTitle,
    saveSetting,
    selectedSetting,
    setDefaults,
    defaultCat,
    defaultDistrict,
    defaultProvince,
    selectedLanguage,
  };
});
