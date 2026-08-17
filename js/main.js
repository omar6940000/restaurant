/* =====================================================
   مذاق الدار — Vue 3 Application (digital menu + orders)
   ===================================================== */

const { createApp, reactive, ref, computed, onMounted, onBeforeUnmount, watch } = Vue;

createApp({
  setup() {
    /* ---------- Categories ---------- */

    const categories = [
      { id: 'all',        label: 'الكل' },
      { id: 'offers',     label: 'العروض' },
      { id: 'popular',    label: 'الأكثر طلباً' },
      { id: 'appetizers', label: 'المقبلات' },
      { id: 'mains',      label: 'الأطباق الرئيسية' },
      { id: 'drinks',     label: 'المشروبات' },
    ];

    /* ---------- Hero slider ---------- */

    const heroSlides = [
      {
        image: 'https://images.pexels.com/photos/36949137/pexels-photo-36949137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        caption: 'أطباق شرقية أصيلة تُطهى بحب كل يوم',
      },
      {
        image: 'https://images.pexels.com/photos/4899822/pexels-photo-4899822.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        caption: 'مشاوينا على الفحم... نكهة لا تُنسى',
      },
      {
        image: 'https://images.pexels.com/photos/11161412/pexels-photo-11161412.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        caption: 'مقبلات طازجة من قلب المطبخ الشامي',
      },
      {
        image: 'https://images.pexels.com/photos/33573200/pexels-photo-33573200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        caption: 'عصائر طبيعية منعشة طوال اليوم',
      },
    ];

    const currentSlide = ref(0);
    let slideTimer = null;

    const startSlider = () => {
      stopSlider();
      slideTimer = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
      }, 5000);
    };

    const stopSlider = () => {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = null;
    };

    const goToSlide = (index) => { currentSlide.value = index; startSlider(); };
    const nextSlide = () => goToSlide((currentSlide.value + 1) % heroSlides.length);
    const prevSlide = () => goToSlide((currentSlide.value - 1 + heroSlides.length) % heroSlides.length);

    /* ---------- Mock menu data (Arabic) ---------- */

    const items = [
      {
        id: 1,
        name: 'باستا حارة',
        description: 'مكرونة بيني مطهية بصلصة الطماطم الحارة مع الفلفل الأحمر والريحان الطازج وجبنة البارميزان المبشورة',
        category: 'mains',
        price: 145,
        popular: true,
        prepTime: 20,
        calories: 640,
        rating: 4.7,
        image: 'https://images.pexels.com/photos/1460872/pexels-photo-1460872.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 2,
        name: 'بيتزا الخضار',
        description: 'عجينة إيطالية طازجة بصلصة الطماطم مع الفلفل الملوّن والزيتون والمشروم وجبنة الموتزاريلا',
        category: 'mains',
        popular: true,
        prepTime: 25,
        calories: 780,
        rating: 4.8,
        sizes: [
          { label: 'صغير', price: 120, oldPrice: 145 },
          { label: 'وسط',  price: 160, oldPrice: 190 },
          { label: 'كبير', price: 200, oldPrice: 240 },
        ],
        defaultSize: 'وسط',
        image: 'https://images.pexels.com/photos/5640015/pexels-photo-5640015.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 3,
        name: 'برجر الدار',
        description: 'لحم بقري ١٨٠ جم مشوي على الفحم مع جبنة الشيدر الذائبة والبصل المكرمل والخس وصوص الدار الخاص',
        category: 'mains',
        price: 185,
        oldPrice: 230,
        popular: true,
        prepTime: 18,
        calories: 850,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/8305726/pexels-photo-8305726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 4,
        name: 'مشاوي مشكلة',
        description: 'تشكيلة فاخرة من الكفتة وشيش الطاووق وريش الضاني، تقدم مع أرز بسمتي وخبز بلدي وسلطات متنوعة',
        category: 'mains',
        price: 320,
        popular: true,
        prepTime: 35,
        calories: 1100,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/4899822/pexels-photo-4899822.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 5,
        name: 'كباب مشوي على الفحم',
        description: 'لحم ضاني مفروم متبل بالبهارات الشرقية الحارة، يشوى على الفحم ويقدم مع خبز مشروح وبصل سماقي',
        category: 'mains',
        price: 260,
        popular: false,
        prepTime: 30,
        calories: 720,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/17303312/pexels-photo-17303312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 6,
        name: 'حمص بالطحينة',
        description: 'حمص مهروس بالطحينة وزيت الزيتون البكر وعصير الليمون الطازج، يقدم مع خبز محمص',
        category: 'appetizers',
        price: 55,
        popular: false,
        prepTime: 10,
        calories: 320,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/5083910/pexels-photo-5083910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 7,
        name: 'تشكيلة مقبلات الدار',
        description: 'متبل باذنجان مدخن، لبنة بالنعناع، محمرة حارة، ورق عنب محشي، ومخللات مشكلة',
        category: 'appetizers',
        price: 95,
        oldPrice: 120,
        popular: true,
        prepTime: 15,
        calories: 450,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/11161412/pexels-photo-11161412.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 8,
        name: 'مقبلات شرقية مشكلة',
        description: 'جبنة بيضاء بالطماطم والزعتر، زيتون متبل، فلفل مشوي، وخضروات طازجة من المزرعة',
        category: 'appetizers',
        price: 80,
        popular: false,
        prepTime: 10,
        calories: 380,
        rating: 4.4,
        image: 'https://images.pexels.com/photos/2452284/pexels-photo-2452284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 9,
        name: 'عصير مانجو طازج',
        description: 'مانجو بلدي طازج ١٠٠٪ بدون أي إضافات صناعية، يقدم مثلجاً مع شرائح المانجو',
        category: 'drinks',
        popular: true,
        prepTime: 5,
        calories: 210,
        rating: 4.9,
        sizes: [
          { label: 'وسط',  price: 45 },
          { label: 'كبير', price: 60 },
        ],
        defaultSize: 'وسط',
        image: 'https://images.pexels.com/photos/16724960/pexels-photo-16724960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 10,
        name: 'ليمون بالنعناع',
        description: 'عصير ليمون طبيعي منعش مع أوراق النعناع الطازج والثلج المجروش',
        category: 'drinks',
        price: 40,
        popular: false,
        prepTime: 5,
        calories: 120,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 11,
        name: 'كوكتيل عصائر الدار',
        description: 'مزيج منعش من الفواكه الموسمية الطازجة مع لمسة من الليمون والنعناع',
        category: 'drinks',
        price: 55,
        popular: false,
        prepTime: 7,
        calories: 180,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/36268520/pexels-photo-36268520.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 12,
        name: 'شاورما الدار بالأرز',
        description: 'شرائح شاورما لحم متبلة على الطريقة الشامية مع أرز أبيض وبطاطس ذهبية وصوص الثومية',
        category: 'mains',
        price: 175,
        popular: false,
        prepTime: 22,
        calories: 890,
        rating: 4.7,
        image: 'https://images.pexels.com/photos/18062061/pexels-photo-18062061.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
    ];

    /* ---------- Customer reviews ---------- */

    const reviews = ref([
      { name: 'محمد عبد الرحمن', rating: 5, text: 'أفضل مشاوي جربتها في القاهرة! اللحم طري ومتبل بشكل مثالي، والتوصيل وصل أسرع من المتوقع. أنصح الجميع بتجربة المشاوي المشكلة.', date: 'منذ أسبوع' },
      { name: 'سارة الشريف', rating: 5, text: 'بيتزا الخضار رائعة والعجينة طازجة فعلاً. المكان نظيف والتعامل راقٍ جداً. أصبح مطعمنا المفضل للعائلة كل نهاية أسبوع.', date: 'منذ أسبوعين' },
      { name: 'أحمد سامي', rating: 4, text: 'الأكل ممتاز والأسعار مناسبة جداً مقارنة بالجودة. برجر الدار يستحق التجربة. نقطة وحيدة: التوصيل تأخر قليلاً وقت الذروة.', date: 'منذ ٣ أسابيع' },
      { name: 'نورهان علي', rating: 5, text: 'طلبت لعزومة عائلية كبيرة وكان كل شيء مثالياً — من التغليف للطعم للالتزام بالمعاد. عصير المانجو الطازج تحفة!', date: 'منذ شهر' },
      { name: 'كريم مصطفى', rating: 5, text: 'خدمة عملاء محترمة جداً وسرعة في الرد على واتساب. المقبلات الشرقية من أفضل ما جربت، وورق العنب يذكرني بأكل البيت.', date: 'منذ شهر' },
    ]);

    const currentReview = ref(0);
    const reviewDirection = ref(1);
    let reviewTimer = null;

    const startReviewSlider = () => {
      stopReviewSlider();
      reviewTimer = setInterval(() => {
        reviewDirection.value = 1;
        currentReview.value = (currentReview.value + 1) % reviews.value.length;
      }, 6000);
    };

    const stopReviewSlider = () => {
      if (reviewTimer) clearInterval(reviewTimer);
      reviewTimer = null;
    };

    const goToReview = (index) => {
      reviewDirection.value = index > currentReview.value ? 1 : -1;
      currentReview.value = index;
      startReviewSlider();
    };

    const nextReview = () => {
      reviewDirection.value = 1;
      currentReview.value = (currentReview.value + 1) % reviews.value.length;
      startReviewSlider();
    };

    const prevReview = () => {
      reviewDirection.value = -1;
      currentReview.value = (currentReview.value - 1 + reviews.value.length) % reviews.value.length;
      startReviewSlider();
    };

    /* ---------- Feedback form ---------- */

    const feedback = reactive({ name: '', phone: '', rating: 0, text: '' });
    const feedbackErrors = reactive({});
    const hoverRating = ref(0);

    const submitFeedback = () => {
      Object.keys(feedbackErrors).forEach((k) => delete feedbackErrors[k]);

      if (!feedback.rating) feedbackErrors.rating = 'من فضلك اختر عدد النجوم';
      if (!feedback.name)   feedbackErrors.name   = 'من فضلك أدخل اسمك';
      if (!feedback.text)   feedbackErrors.text   = 'من فضلك اكتب رأيك';

      if (Object.keys(feedbackErrors).length) return;

      reviews.value.unshift({
        name: feedback.name,
        rating: feedback.rating,
        text: feedback.text,
        date: 'الآن',
      });
      reviewDirection.value = -1;
      currentReview.value = 0;
      startReviewSlider();

      feedback.name = ''; feedback.phone = ''; feedback.rating = 0; feedback.text = '';
      showToast('شكراً لك! تم إضافة تقييمك بنجاح ⭐');
    };

    /* ---------- Reactive state ---------- */

    const isLoading        = ref(true);
    const isScrolled       = ref(false);
    const selectedItem     = ref(null);
    const modalQty         = ref(1);
    const searchQuery      = ref('');
    const activeCategory   = ref('all');
    const isFilterOpen     = ref(false);
    const priceRange       = ref('all');
    const sortBy           = ref('default');

    const priceRanges = [
      { id: 'all',   label: 'كل الأسعار' },
      { id: 'lt100', label: 'أقل من ١٠٠ ج.م' },
      { id: 'mid',   label: '١٠٠ – ٢٠٠ ج.م' },
      { id: 'gt200', label: 'أكثر من ٢٠٠ ج.م' },
    ];

    const sortOptions = [
      { id: 'default',    label: 'الترتيب الافتراضي' },
      { id: 'price-asc',  label: 'السعر: من الأقل للأعلى' },
      { id: 'price-desc', label: 'السعر: من الأعلى للأقل' },
      { id: 'rating',     label: 'الأعلى تقييماً' },
    ];

    const selectedSizes = reactive({});
    items.forEach((item) => {
      if (item.sizes) selectedSizes[item.id] = item.defaultSize || item.sizes[0].label;
    });

    /* ---------- Cart (order collection) ---------- */

    const RESTAURANT_WHATSAPP = '201000000000'; // رقم واتساب المطعم

    const cart = ref([]);
    const isCartOpen = ref(false);
    const toast = ref('');
    let toastTimer = null;

    /* ---------- Checkout: customer & address details ---------- */

    const checkoutStep = ref('cart');        // 'cart' | 'address'
    const orderType    = ref('delivery');    // 'delivery' | 'pickup'

    const customer = reactive({
      name: '', phone: '',
      district: '', street: '', landmark: '',
      notes: '',
    });

    const formErrors = reactive({});

    // Remember customer details for the next order
    try {
      const saved = JSON.parse(localStorage.getItem('mazaq-customer') || 'null');
      if (saved) Object.assign(customer, saved);
      const savedType = localStorage.getItem('mazaq-order-type');
      if (savedType) orderType.value = savedType;
    } catch (e) { /* ignore corrupted storage */ }

    watch(customer, (val) => {
      localStorage.setItem('mazaq-customer', JSON.stringify(val));
    }, { deep: true });

    watch(orderType, (val) => {
      localStorage.setItem('mazaq-order-type', val);
      Object.keys(formErrors).forEach((k) => delete formErrors[k]);
    });

    // Convert Arabic-Indic digits to Latin (for phone validation)
    const toLatinDigits = (str) =>
      str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
         .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

    const validateForm = () => {
      Object.keys(formErrors).forEach((k) => delete formErrors[k]);

      if (!customer.name) formErrors.name = 'من فضلك أدخل اسمك';

      const phone = toLatinDigits(customer.phone).replace(/[\s-]/g, '');
      if (!phone) {
        formErrors.phone = 'من فضلك أدخل رقم هاتفك';
      } else if (!/^(\+?2?01[0-9]{9})$/.test(phone)) {
        formErrors.phone = 'أدخل رقم هاتف مصري صحيح (مثال: 01012345678)';
      }

      if (orderType.value === 'delivery') {
        if (!customer.district) formErrors.district = 'من فضلك أدخل المنطقة أو الحي';
        if (!customer.street)   formErrors.street   = 'من فضلك أدخل اسم الشارع';
      }

      return Object.keys(formErrors).length === 0;
    };

    const cartCount = computed(() => cart.value.reduce((sum, l) => sum + l.qty, 0));
    const cartTotal = computed(() => cart.value.reduce((sum, l) => sum + l.unitPrice * l.qty, 0));

    const showToast = (msg) => {
      toast.value = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.value = ''; }, 2200);
    };

    const addToCart = (item, qty = 1) => {
      const size = item.sizes ? selectedSizes[item.id] : null;
      const key = size ? `${item.id}-${size}` : `${item.id}`;
      const existing = cart.value.find((l) => l.key === key);

      if (existing) {
        existing.qty += qty;
      } else {
        cart.value.push({
          key,
          id: item.id,
          name: item.name,
          size,
          unitPrice: currentPrice(item),
          oldUnitPrice: currentOldPrice(item),
          qty,
          image: item.image,
        });
      }
      showToast(`تمت إضافة «${item.name}» إلى طلبك`);
    };

    const changeQty = (key, delta) => {
      const line = cart.value.find((l) => l.key === key);
      if (!line) return;
      line.qty += delta;
      if (line.qty <= 0) removeLine(key);
    };

    const removeLine = (key) => {
      cart.value = cart.value.filter((l) => l.key !== key);
    };

    const clearCart = () => {
      cart.value = [];
      showToast('تم تفريغ السلة');
    };

    const checkout = () => {
      if (!validateForm()) {
        showToast('من فضلك أكمل البيانات المطلوبة');
        return;
      }

      const lines = cart.value.map((l) => {
        const sizePart = l.size ? ` (${l.size})` : '';
        return `• ${l.name}${sizePart} × ${l.qty} — ${l.unitPrice * l.qty} ج.م`;
      });

      let message =
        `مرحباً، أود تأكيد الطلب التالي من مذاق الدار:\n\n` +
        lines.join('\n') +
        `\n\nالإجمالي: ${cartTotal.value} ج.م` +
        `\n\n————————————` +
        `\nالاسم: ${customer.name}` +
        `\nرقم الهاتف: ${toLatinDigits(customer.phone)}`;

      if (orderType.value === 'delivery') {
        message += `\nطريقة الاستلام: توصيل للمنزل 🛵`;
        message += `\n\n📍 العنوان بالتفصيل:`;
        message += `\nالمنطقة / الحي: ${customer.district}`;
        message += `\nالشارع: ${customer.street}`;
        if (customer.landmark) message += `\nعلامة مميزة: ${customer.landmark}`;
      } else {
        message += `\nطريقة الاستلام: استلام من الفرع 🏪`;
      }

      if (customer.notes) message += `\n\nملاحظات: ${customer.notes}`;

      window.open(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
    };

    /* ---------- Image loading indicators ---------- */

    // Marks an <img> as loaded so CSS can hide its spinner and fade it in.
    // Attached in the capture phase: 'load' doesn't bubble, but capturing
    // catches it for every image — including ones Vue renders later.
    const markImgLoaded = (e) => {
      const el = e.target;
      if (el && el.tagName === 'IMG') el.classList.add('img-loaded');
    };

    // Images served from cache may already be complete before the listener sees them
    const sweepLoadedImages = () => {
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth > 0) img.classList.add('img-loaded');
      });
    };

    /* ---------- Lifecycle ---------- */

    onMounted(() => {
      // Preload only the first hero slide, then dismiss the splash screen
      const hero = new Image();
      hero.src = heroSlides[0].image;
      const dismiss = () => setTimeout(() => { isLoading.value = false; }, 900);
      hero.onload = dismiss;
      hero.onerror = dismiss;
      setTimeout(() => { isLoading.value = false; }, 3500); // safety net

      // Preload remaining slides in the background
      heroSlides.slice(1).forEach((s) => { new Image().src = s.image; });

      startSlider();
      startReviewSlider();
      initPwa();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKeydown);

      // Image loading indicators
      document.addEventListener('load', markImgLoaded, true);
      document.addEventListener('error', markImgLoaded, true); // hide spinner on failure too
      sweepLoadedImages();
    });

    onBeforeUnmount(() => {
      stopSlider();
      stopReviewSlider();
      clearTimeout(toastTimer);
      clearTimeout(installedHideTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      document.removeEventListener('load', markImgLoaded, true);
      document.removeEventListener('error', markImgLoaded, true);
    });

    /* ---------- Navbar ---------- */

    const onScroll = () => { isScrolled.value = window.scrollY > 40; };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    /* ---------- PWA: install app (navbar button) ---------- */

    const isStandalone = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // True only for real phones/tablets — desktop never shows the install button,
    // even if the browser window is resized to a narrow width
    const isMobileDevice = ref(
      /android|iphone|ipad|ipod|windows phone|mobile|tablet/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches)
    );

    // Install flow state: 'idle' → 'installing' → 'installed' → 'done' (button removed)
    const installState = ref(isStandalone() ? 'done' : 'idle');
    const showInstallConfirm = ref(false);
    let deferredPrompt = null;
    let installedHideTimer = null;

    // Capture the native prompt when the browser provides it (no UI dependency)
    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    // Show "تم التثبيت" briefly, then remove the button
    const markInstalled = () => {
      installState.value = 'installed';
      showToast('تم تثبيت التطبيق بنجاح 🎉');
      clearTimeout(installedHideTimer);
      installedHideTimer = setTimeout(() => { installState.value = 'done'; }, 2500);
    };

    // Fired by the browser when the download/installation completes
    const onAppInstalled = () => {
      deferredPrompt = null;
      showInstallConfirm.value = false;
      markInstalled();
    };

    // User approved in the confirmation dialog → trigger installation directly
    const confirmInstall = async () => {
      showInstallConfirm.value = false;

      // "جاري التثبيت..." appears immediately upon approval
      installState.value = 'installing';
      showToast('جاري التثبيت...');

      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;

        if (outcome === 'accepted') {
          // Wait for the 'appinstalled' event; fall back in case it never fires
          setTimeout(() => {
            if (installState.value === 'installing') markInstalled();
          }, 6000);
        } else {
          // User dismissed the native popup — back to idle
          installState.value = 'idle';
        }
      } else {
        installState.value = 'idle';
        showToast('التثبيت غير متاح على هذا المتصفح حالياً');
      }
    };

    const initPwa = () => {
      // Register the service worker (required for installability).
      // Guarded: SW only works over http(s), so avoid errors on file:// previews.
      if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      }

      window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.addEventListener('appinstalled', onAppInstalled);
    };



    /* ---------- Product modal ---------- */

    const openItem = (item) => {
      selectedItem.value = item;
      modalQty.value = 1;
    };
    const closeItem = () => { selectedItem.value = null; };

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        if (showInstallConfirm.value) { showInstallConfirm.value = false; return; }
        if (selectedItem.value) { closeItem(); return; }
        if (isCartOpen.value)   { isCartOpen.value = false; return; }
        if (isFilterOpen.value) { isFilterOpen.value = false; }
      }
    };

    // Lock body scroll while a modal/drawer is open
    watch([selectedItem, isCartOpen, isFilterOpen], ([item, cartOpen, filterOpen]) => {
      document.body.classList.toggle('no-scroll', !!item || cartOpen || filterOpen);
    });

    // Reset the checkout flow when the drawer closes or the cart empties
    watch(isCartOpen, (open) => {
      if (!open) checkoutStep.value = 'cart';
    });

    watch(cartCount, (count) => {
      if (count === 0) checkoutStep.value = 'cart';
    });

    /* ---------- Filtering actions ---------- */

    const selectSize = (itemId, sizeLabel) => {
      selectedSizes[itemId] = sizeLabel;
    };

    const resetFilters = () => {
      searchQuery.value = '';
      activeCategory.value = 'all';
      priceRange.value = 'all';
      sortBy.value = 'default';
    };

    /* ---------- Derived state ---------- */

    const normalize = (str) =>
      str
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[\u064B-\u065F]/g, '')
        .trim();

    const filteredItems = computed(() => {
      const q = normalize(searchQuery.value.toLowerCase());

      const result = items.filter((item) => {
        if (activeCategory.value === 'popular') {
          if (!item.popular) return false;
        } else if (activeCategory.value === 'offers') {
          if (!isOnSale(item)) return false;
        } else if (activeCategory.value !== 'all' && item.category !== activeCategory.value) {
          return false;
        }

        // Price range
        const p = currentPrice(item);
        if (priceRange.value === 'lt100' && p >= 100) return false;
        if (priceRange.value === 'mid'   && (p < 100 || p > 200)) return false;
        if (priceRange.value === 'gt200' && p <= 200) return false;

        if (q && !normalize(item.name).includes(q) && !normalize(item.description).includes(q)) {
          return false;
        }

        return true;
      });

      // Sorting
      if (sortBy.value === 'price-asc')  result.sort((a, b) => currentPrice(a) - currentPrice(b));
      if (sortBy.value === 'price-desc') result.sort((a, b) => currentPrice(b) - currentPrice(a));
      if (sortBy.value === 'rating')     result.sort((a, b) => b.rating - a.rating);

      return result;
    });

    /* ---------- "Show more": 8 products, then load 8 more per click ---------- */

    const PAGE_SIZE = 8;
    const visibleCount = ref(PAGE_SIZE);

    const displayedItems = computed(() => filteredItems.value.slice(0, visibleCount.value));

    const showMore = () => { visibleCount.value += PAGE_SIZE; };

    // Number of dishes actually shown (never exceeds the result count)
    const shownCount = computed(() =>
      Math.min(visibleCount.value, filteredItems.value.length)
    );

    // Reset whenever the filters change
    watch([searchQuery, activeCategory, priceRange, sortBy], () => {
      visibleCount.value = PAGE_SIZE;
    });

    // Item count per category tab (for the filter panel badges)
    const categoryCounts = computed(() => {
      const counts = {};
      categories.forEach((cat) => {
        if (cat.id === 'all') counts[cat.id] = items.length;
        else if (cat.id === 'popular') counts[cat.id] = items.filter((i) => i.popular).length;
        else if (cat.id === 'offers') counts[cat.id] = items.filter((i) => isOnSale(i)).length;
        else counts[cat.id] = items.filter((i) => i.category === cat.id).length;
      });
      return counts;
    });

    const hasActiveFilters = computed(() =>
      !!searchQuery.value || activeCategory.value !== 'all' ||
      priceRange.value !== 'all' || sortBy.value !== 'default'
    );

    // Number of active filter criteria (badge on the floating filter button)
    const activeFilterCount = computed(() => {
      let n = 0;
      if (searchQuery.value) n++;
      if (activeCategory.value !== 'all') n++;
      if (priceRange.value !== 'all') n++;
      if (sortBy.value !== 'default') n++;
      return n;
    });

    /* ---------- Helpers ---------- */

    const currentPrice = (item) => {
      if (!item.sizes) return item.price;
      const size = item.sizes.find((s) => s.label === selectedSizes[item.id]);
      return size ? size.price : item.sizes[0].price;
    };

    // Original (pre-discount) price for the current selection, or null if not on offer
    const currentOldPrice = (item) => {
      if (!item.sizes) return item.oldPrice || null;
      const size = item.sizes.find((s) => s.label === selectedSizes[item.id]) || item.sizes[0];
      return size.oldPrice || null;
    };

    const isOnSale = (item) =>
      item.oldPrice ? true : !!(item.sizes && item.sizes.some((s) => s.oldPrice));

    // Discount percentage for the badge (based on current selection or first discounted size)
    const discountPercent = (item) => {
      let price, old;
      if (item.sizes) {
        const size = item.sizes.find((s) => s.label === selectedSizes[item.id]) || item.sizes[0];
        const refSize = size.oldPrice ? size : item.sizes.find((s) => s.oldPrice);
        if (!refSize) return 0;
        price = refSize.price; old = refSize.oldPrice;
      } else {
        if (!item.oldPrice) return 0;
        price = item.price; old = item.oldPrice;
      }
      return Math.round((1 - price / old) * 100);
    };

    // Arabic-Indic numerals: 160 -> ١٦٠ / 4.7 -> ٤٫٧
    const formatPrice = (value) =>
      new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(value);

    return {
      // data
      categories, heroSlides,
      // state
      isLoading, isScrolled,
      selectedItem, modalQty, searchQuery, activeCategory,
      selectedSizes, filteredItems, currentSlide,
      categoryCounts, hasActiveFilters, activeFilterCount,
      isFilterOpen, priceRange, sortBy, priceRanges, sortOptions,
      displayedItems, visibleCount, showMore, shownCount,
      reviews, currentReview, reviewDirection, goToReview, nextReview, prevReview,
      feedback, feedbackErrors, hoverRating, submitFeedback,
      cart, isCartOpen, toast, cartCount, cartTotal,
      checkoutStep, orderType, customer, formErrors,
      // actions
      selectSize, resetFilters,
      currentPrice, currentOldPrice, isOnSale, discountPercent, formatPrice,
      openItem, closeItem, scrollTop,
      installState, showInstallConfirm, confirmInstall, isMobileDevice,
      goToSlide, nextSlide, prevSlide,
      addToCart, changeQty, removeLine, clearCart, checkout,
    };
  },
}).mount('#app');
