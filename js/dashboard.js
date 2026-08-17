/* =====================================================
   مذاق الدار — لوحة الإدارة المبسطة (Vue 3, standalone)
   ===================================================== */

const { createApp, reactive, ref, computed, onMounted, onBeforeUnmount } = Vue;

createApp({
  setup() {
    /* ---------- Views ---------- */

    const views = [
      { id: 'form',       label: 'إضافة منتج' },
      { id: 'products',   label: 'جدول المنتجات' },
      { id: 'categories', label: 'أقسام القائمة' },
      { id: 'reviews',    label: 'رسائل العملاء' },
      { id: 'settings',   label: 'بيانات الموقع' },
    ];

    const activeView = ref('form');

    /* ---------- Loading screen ---------- */

    const isLoading = ref(true);

    const todayLabel = new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date());

    /* ---------- Toast ---------- */

    const toast = ref('');
    let toastTimer = null;
    const showToast = (msg) => {
      toast.value = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.value = ''; }, 2200);
    };

    /* ---------- Categories ---------- */

    const menuCategories = reactive([
      { id: 1, name: 'المقبلات' },
      { id: 2, name: 'الأطباق الرئيسية' },
      { id: 3, name: 'المشروبات' },
    ]);

    const newCategory = ref('');
    const categoryError = ref('');
    const categoryFilter = ref('');

    const filteredCategories = computed(() =>
      categoryFilter.value
        ? menuCategories.filter((c) => matches(c.name, categoryFilter.value))
        : menuCategories
    );

    const addCategory = () => {
      categoryError.value = '';
      const name = newCategory.value;

      if (!name) {
        categoryError.value = 'من فضلك أدخل اسم القسم';
        return;
      }
      if (menuCategories.some((c) => c.name === name)) {
        categoryError.value = 'هذا القسم موجود بالفعل';
        return;
      }

      menuCategories.push({ id: Date.now(), name });
      newCategory.value = '';
      showToast(`تمت إضافة قسم «${name}» بنجاح`);
    };

    /* ---------- Products ---------- */

    const IMG = (id) =>
      `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=96&w=96`;

    const products = reactive([
      {
        id: 1,
        name: 'باستا حارة',
        description: 'مكرونة بيني بصلصة الطماطم الحارة مع الريحان والبارميزان',
        category: 'الأطباق الرئيسية',
        price: 145, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 0,
        image: IMG(1460872),
      },
      {
        id: 2,
        name: 'بيتزا الخضار',
        description: 'عجينة إيطالية بصلصة الطماطم والفلفل الملوّن والزيتون والموتزاريلا',
        category: 'الأطباق الرئيسية',
        price: 190, sizeSmall: 120, sizeMedium: 160, sizeLarge: 200, discount: 15,
        image: IMG(5640015),
      },
      {
        id: 3,
        name: 'برجر الدار',
        description: 'لحم بقري ١٨٠ جم مع شيدر ذائب وبصل مكرمل وصوص الدار',
        category: 'الأطباق الرئيسية',
        price: 230, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 20,
        image: IMG(8305726),
      },
      {
        id: 4,
        name: 'مشاوي مشكلة',
        description: 'كفتة وشيش طاووق وريش ضاني مع أرز بسمتي وخبز بلدي',
        category: 'الأطباق الرئيسية',
        price: 320, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 0,
        image: IMG(4899822),
      },
      {
        id: 5,
        name: 'حمص بالطحينة',
        description: 'حمص مهروس بالطحينة وزيت الزيتون البكر والليمون',
        category: 'المقبلات',
        price: 55, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 0,
        image: IMG(5083910),
      },
      {
        id: 6,
        name: 'تشكيلة مقبلات الدار',
        description: 'متبل باذنجان ولبنة بالنعناع ومحمرة وورق عنب ومخللات',
        category: 'المقبلات',
        price: 120, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 21,
        image: IMG(11161412),
      },
      {
        id: 7,
        name: 'عصير مانجو طازج',
        description: 'مانجو بلدي طازج ١٠٠٪ يقدم مثلجاً',
        category: 'المشروبات',
        price: 45, sizeSmall: null, sizeMedium: 45, sizeLarge: 60, discount: 0,
        image: IMG(16724960),
      },
      {
        id: 8,
        name: 'ليمون بالنعناع',
        description: 'عصير ليمون طبيعي مع النعناع الطازج والثلج المجروش',
        category: 'المشروبات',
        price: 40, sizeSmall: null, sizeMedium: null, sizeLarge: null, discount: 0,
        image: IMG(2109099),
      },
    ]);

    const productCountFor = (categoryName) =>
      products.filter((p) => p.category === categoryName).length;

    // Price after applying the discount percentage
    const discountedPrice = (p) =>
      Math.round(p.price * (1 - (p.discount || 0) / 100));

    const hasSizes = (p) => !!(p.sizeSmall || p.sizeMedium || p.sizeLarge);

    /* ---------- Products table filters ---------- */

    const defaultFilters = () => ({
      name: '',
      category: 'all',
      price: 'all',
      discount: 'all',
    });

    const productFilters = reactive(defaultFilters());

    const filteredProducts = computed(() =>
      products.filter((p) => {
        // Name or description (same search input, Arabic-insensitive)
        if (productFilters.name &&
            !matches(p.name, productFilters.name) &&
            !matches(p.description, productFilters.name)) return false;

        // Category
        if (productFilters.category !== 'all' && p.category !== productFilters.category) return false;

        // Price (uses the discounted price when applicable)
        const price = discountedPrice(p);
        if (productFilters.price === 'lt100' && price >= 100) return false;
        if (productFilters.price === 'mid'   && (price < 100 || price > 200)) return false;
        if (productFilters.price === 'gt200' && price <= 200) return false;

        // Discount status
        if (productFilters.discount === 'discounted' && !p.discount) return false;
        if (productFilters.discount === 'regular' && p.discount) return false;

        return true;
      })
    );

    const hasProductFilters = computed(() =>
      productFilters.name !== '' || productFilters.category !== 'all' ||
      productFilters.price !== 'all' || productFilters.discount !== 'all'
    );

    const resetProductFilters = () => Object.assign(productFilters, defaultFilters());

    /* ---------- Product details modal ---------- */

    const selectedProduct = ref(null);
    const openProduct = (p) => { selectedProduct.value = p; };

    /* ---------- Product submission form ---------- */

    const FALLBACK_IMAGE =
      'https://images.pexels.com/photos/6046747/pexels-photo-6046747.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=96&w=96';

    const emptyForm = () => ({
      name: '',
      category: '',
      description: '',
      pricingType: 'base',   // 'base' | 'sizes'
      price: null,
      discount: null,
      sizeSmall: null,
      sizeMedium: null,
      sizeLarge: null,
      imagePreview: '',
      imageName: '',
    });

    const productForm = reactive(emptyForm());
    const formError = ref('');

    const onImageSelect = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        formError.value = 'من فضلك اختر ملف صورة صالح (PNG أو JPG)';
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        formError.value = 'حجم الصورة أكبر من ٥ ميجابايت';
        e.target.value = '';
        return;
      }

      formError.value = '';
      const reader = new FileReader();
      reader.onload = () => {
        productForm.imagePreview = reader.result;
        productForm.imageName = file.name;
      };
      reader.readAsDataURL(file);
    };

    const clearImage = () => {
      productForm.imagePreview = '';
      productForm.imageName = '';
      const input = document.getElementById('p-image');
      if (input) input.value = '';
    };

    const submitProduct = () => {
      formError.value = '';

      if (!productForm.imagePreview) {
        formError.value = 'من فضلك اختر صورة للمنتج';
        return;
      }
      if (!productForm.name || !productForm.category || !productForm.description) {
        formError.value = 'من فضلك أكمل الحقول المطلوبة (الاسم، القسم، الوصف)';
        return;
      }

      const isSizes = productForm.pricingType === 'sizes';

      if (isSizes) {
        if (!productForm.sizeSmall || !productForm.sizeMedium || !productForm.sizeLarge) {
          formError.value = 'من فضلك أدخل أسعار الأحجام الثلاثة (صغير، وسط، كبير)';
          return;
        }
      } else if (!productForm.price || productForm.price <= 0) {
        formError.value = 'من فضلك أدخل السعر الأساسي';
        return;
      }

      products.push({
        id: Date.now(),
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        // For size-based pricing, the medium price acts as the reference price
        price: isSizes ? productForm.sizeMedium : productForm.price,
        sizeSmall: isSizes ? productForm.sizeSmall : null,
        sizeMedium: isSizes ? productForm.sizeMedium : null,
        sizeLarge: isSizes ? productForm.sizeLarge : null,
        discount: productForm.discount || 0,
        image: productForm.imagePreview || FALLBACK_IMAGE,
      });

      const savedName = productForm.name;
      Object.assign(productForm, emptyForm());
      const input = document.getElementById('p-image');
      if (input) input.value = '';

      showToast(`تم حفظ «${savedName}» بنجاح`);
      activeView.value = 'products';
    };

    /* ---------- Customer messages ---------- */

    const customerReviews = reactive([
      { name: 'محمد عبد الرحمن', phone: '01012345678', read: false, text: 'أفضل مشاوي جربتها في القاهرة! اللحم طري ومتبل بشكل مثالي، والتوصيل وصل أسرع من المتوقع. أنصح الجميع بتجربة المشاوي المشكلة مع الأرز البسمتي.' },
      { name: 'سارة الشريف',    phone: '01123456789', read: false, text: 'بيتزا الخضار رائعة والعجينة طازجة فعلاً. المكان نظيف والتعامل راقٍ جداً. أصبح مطعمنا المفضل للعائلة كل نهاية أسبوع.' },
      { name: 'أحمد سامي',      phone: '01234567890', read: true,  text: 'الأكل ممتاز والأسعار مناسبة جداً مقارنة بالجودة. برجر الدار يستحق التجربة. نقطة وحيدة: التوصيل تأخر قليلاً وقت الذروة، أتمنى تحسين ذلك.' },
      { name: 'نورهان علي',     phone: '01098765432', read: false, text: 'طلبت لعزومة عائلية كبيرة وكان كل شيء مثالياً — من التغليف للطعم للالتزام بالمعاد. عصير المانجو الطازج تحفة! شكراً لكم.' },
      { name: 'كريم مصطفى',     phone: '01187654321', read: true,  text: 'خدمة عملاء محترمة جداً وسرعة في الرد على واتساب. المقبلات الشرقية من أفضل ما جربت، وورق العنب يذكرني بأكل البيت.' },
      { name: 'دينا صلاح',      phone: '01276543210', read: true,  text: 'تجربة ممتازة من أول مرة! عصير المانجو طبيعي ١٠٠٪ والمقبلات طازجة جداً. سأكرر الطلب بالتأكيد وأنصح أصدقائي بكم.' },
    ]);

    /* ---------- Messages filters ---------- */

    const messageFilters = reactive({ name: '', read: 'all' });

    const filteredMessages = computed(() =>
      customerReviews.filter((r) => {
        if (messageFilters.name && !matches(r.name, messageFilters.name)) return false;
        if (messageFilters.read === 'read' && !r.read) return false;
        if (messageFilters.read === 'unread' && r.read) return false;
        return true;
      })
    );

    const selectedMessage = ref(null);

    // Opening a message marks it as viewed
    const openMessage = (msg) => {
      selectedMessage.value = msg;
      msg.read = true;
    };

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        selectedMessage.value = null;
        selectedProduct.value = null;
      }
    };

    /* ---------- Image loading indicators ---------- */

    // Capture-phase listener: catches 'load' for every <img>, including future ones
    const markImgLoaded = (e) => {
      const el = e.target;
      if (el && el.tagName === 'IMG') el.classList.add('img-loaded');
    };

    const sweepLoadedImages = () => {
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth > 0) img.classList.add('img-loaded');
      });
    };

    onMounted(() => {
      window.addEventListener('keydown', onKeydown);
      document.addEventListener('load', markImgLoaded, true);
      document.addEventListener('error', markImgLoaded, true); // hide spinner on failure too
      sweepLoadedImages();
      // Dismiss the loading screen once everything is ready
      setTimeout(() => { isLoading.value = false; }, 1100);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown);
      document.removeEventListener('load', markImgLoaded, true);
      document.removeEventListener('error', markImgLoaded, true);
    });

    /* ---------- Site settings ---------- */

    const siteSettings = reactive({
      logo: '',        // Data-URL of the uploaded brand logo
      logoName: '',
      name: 'مذاق الدار',
      slogan: 'أطباق شرقية أصيلة تُطهى بحب كل يوم',
      whatsapp: '01000000000',
      phone: '01000000000',
      openTime: '١٢ ظهراً',
      closeTime: '١ صباحاً',
      address: 'شارع عباس العقاد، مدينة نصر، القاهرة',
      mapsUrl: '',
      instagram: '',
      facebook: '',
      tiktok: '',
    });

    const settingsError = ref('');
    const logoError = ref('');

    const onLogoSelect = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        logoError.value = 'من فضلك اختر ملف صورة صالح (PNG أو JPG)';
        e.target.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        logoError.value = 'حجم الشعار أكبر من ٢ ميجابايت';
        e.target.value = '';
        return;
      }

      logoError.value = '';
      const reader = new FileReader();
      reader.onload = () => {
        siteSettings.logo = reader.result;
        siteSettings.logoName = file.name;
        showToast('تم رفع الشعار — لا تنسَ حفظ البيانات');
      };
      reader.readAsDataURL(file);
    };

    const clearLogo = () => {
      siteSettings.logo = '';
      siteSettings.logoName = '';
      logoError.value = '';
      const input = document.getElementById('s-logo');
      if (input) input.value = '';
    };

    // Restore previously saved settings
    try {
      const saved = JSON.parse(localStorage.getItem('mazaq-site-settings') || 'null');
      if (saved) Object.assign(siteSettings, saved);
    } catch (e) { /* ignore corrupted storage */ }

    const saveSiteSettings = () => {
      settingsError.value = '';

      if (!siteSettings.name || !siteSettings.whatsapp || !siteSettings.phone || !siteSettings.address) {
        settingsError.value = 'من فضلك أكمل الحقول المطلوبة (الاسم، رقم الرسائل، رقم الهاتف، العنوان)';
        return;
      }

      const digits = siteSettings.whatsapp.replace(/[\s-]/g, '');
      if (!/^(\+?2?01[0-9]{9})$/.test(digits)) {
        settingsError.value = 'أدخل رقم واتساب مصري صحيح لاستقبال الرسائل (مثال: 01012345678)';
        return;
      }

      try {
        localStorage.setItem('mazaq-site-settings', JSON.stringify(siteSettings));
      } catch (e) {
        // Storage quota exceeded (large logo) — keep in memory only
        settingsError.value = 'تم الحفظ مؤقتاً — الشعار كبير جداً للتخزين الدائم، جرّب صورة أصغر';
        return;
      }
      showToast('تم حفظ بيانات الموقع بنجاح');
    };

    /* ---------- Helpers ---------- */

    const fmt = (value) =>
      new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(value);

    // Arabic-insensitive matching: unifies أ/إ/آ→ا, ة→ه, ى→ي and strips tashkeel
    const normalize = (str) =>
      String(str)
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[\u064B-\u065F]/g, '')
        .trim();

    const matches = (text, query) => normalize(text).includes(normalize(query));

    return {
      views, activeView, isLoading, todayLabel, toast,
      menuCategories, newCategory, categoryError, addCategory, productCountFor,
      categoryFilter, filteredCategories,
      messageFilters, filteredMessages,
      products, productForm, formError, submitProduct, onImageSelect, clearImage, discountedPrice, hasSizes,
      productFilters, filteredProducts, hasProductFilters, resetProductFilters,
      selectedProduct, openProduct,
      customerReviews, selectedMessage, openMessage,
      siteSettings, settingsError, saveSiteSettings,
      logoError, onLogoSelect, clearLogo, fmt,
    };
  },
}).mount('#dashboard');
