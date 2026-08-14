/* =====================================================
   مذاق الدار — Vue 3 Application (digital menu + orders)
   ===================================================== */

const { createApp, reactive, ref, computed, onMounted, onBeforeUnmount, watch } = Vue;

createApp({
  setup() {
    /* ---------- Categories & filters ---------- */

    const categories = [
      { id: 'all',        label: 'الكل' },
      { id: 'popular',    label: 'الأكثر طلباً' },
      { id: 'appetizers', label: 'المقبلات' },
      { id: 'mains',      label: 'الأطباق الرئيسية' },
      { id: 'drinks',     label: 'المشروبات' },
    ];

    const quickFilters = [
      { id: 'hot',        label: 'حار' },
      { id: 'bestseller', label: 'الأكثر مبيعاً' },
      { id: 'veg',        label: 'نباتي' },
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
        tags: ['hot'],
        popular: true,
        badge: { type: 'hot', label: 'حار' },
        prepTime: 20,
        calories: 640,
        rating: 4.7,
        ingredients: ['مكرونة بيني', 'صلصة طماطم', 'فلفل أحمر حار', 'ريحان طازج', 'بارميزان', 'زيت زيتون'],
        image: 'https://images.pexels.com/photos/1460872/pexels-photo-1460872.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 2,
        name: 'بيتزا الخضار',
        description: 'عجينة إيطالية طازجة بصلصة الطماطم مع الفلفل الملوّن والزيتون والمشروم وجبنة الموتزاريلا',
        category: 'mains',
        tags: ['veg'],
        popular: true,
        badge: { type: 'veg', label: 'نباتي' },
        prepTime: 25,
        calories: 780,
        rating: 4.8,
        ingredients: ['عجينة إيطالية', 'صلصة طماطم', 'فلفل ملوّن', 'زيتون أسود', 'مشروم', 'موتزاريلا'],
        sizes: [
          { label: 'صغير', price: 120 },
          { label: 'وسط',  price: 160 },
          { label: 'كبير', price: 200 },
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
        tags: ['bestseller'],
        popular: true,
        badge: { type: 'bestseller', label: 'الأكثر مبيعاً' },
        prepTime: 18,
        calories: 850,
        rating: 4.9,
        ingredients: ['لحم بقري ١٨٠ جم', 'جبنة شيدر', 'بصل مكرمل', 'خس طازج', 'صوص الدار', 'خبز بريوش'],
        image: 'https://images.pexels.com/photos/8305726/pexels-photo-8305726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 4,
        name: 'مشاوي مشكلة',
        description: 'تشكيلة فاخرة من الكفتة وشيش الطاووق وريش الضاني، تقدم مع أرز بسمتي وخبز بلدي وسلطات متنوعة',
        category: 'mains',
        price: 320,
        tags: ['bestseller'],
        popular: true,
        badge: { type: 'bestseller', label: 'الأكثر مبيعاً' },
        prepTime: 35,
        calories: 1100,
        rating: 4.9,
        ingredients: ['كفتة', 'شيش طاووق', 'ريش ضاني', 'أرز بسمتي', 'خبز بلدي', 'سلطات مشكلة'],
        image: 'https://images.pexels.com/photos/4899822/pexels-photo-4899822.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 5,
        name: 'كباب مشوي على الفحم',
        description: 'لحم ضاني مفروم متبل بالبهارات الشرقية الحارة، يشوى على الفحم ويقدم مع خبز مشروح وبصل سماقي',
        category: 'mains',
        price: 260,
        tags: ['hot'],
        popular: false,
        badge: { type: 'hot', label: 'حار' },
        prepTime: 30,
        calories: 720,
        rating: 4.6,
        ingredients: ['لحم ضاني مفروم', 'بهارات شرقية', 'بقدونس', 'بصل سماقي', 'خبز مشروح'],
        image: 'https://images.pexels.com/photos/17303312/pexels-photo-17303312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 6,
        name: 'حمص بالطحينة',
        description: 'حمص مهروس بالطحينة وزيت الزيتون البكر وعصير الليمون الطازج، يقدم مع خبز محمص',
        category: 'appetizers',
        price: 55,
        tags: ['veg'],
        popular: false,
        badge: { type: 'veg', label: 'نباتي' },
        prepTime: 10,
        calories: 320,
        rating: 4.5,
        ingredients: ['حمص', 'طحينة', 'زيت زيتون بكر', 'ليمون', 'كمون', 'خبز محمص'],
        image: 'https://images.pexels.com/photos/5083910/pexels-photo-5083910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 7,
        name: 'تشكيلة مقبلات الدار',
        description: 'متبل باذنجان مدخن، لبنة بالنعناع، محمرة حارة، ورق عنب محشي، ومخللات مشكلة',
        category: 'appetizers',
        price: 95,
        tags: ['veg', 'bestseller'],
        popular: true,
        badge: { type: 'bestseller', label: 'الأكثر مبيعاً' },
        prepTime: 15,
        calories: 450,
        rating: 4.8,
        ingredients: ['متبل باذنجان', 'لبنة بالنعناع', 'محمرة حارة', 'ورق عنب', 'مخللات مشكلة'],
        image: 'https://images.pexels.com/photos/11161412/pexels-photo-11161412.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 8,
        name: 'مقبلات شرقية مشكلة',
        description: 'جبنة بيضاء بالطماطم والزعتر، زيتون متبل، فلفل مشوي، وخضروات طازجة من المزرعة',
        category: 'appetizers',
        price: 80,
        tags: ['veg'],
        popular: false,
        badge: { type: 'veg', label: 'نباتي' },
        prepTime: 10,
        calories: 380,
        rating: 4.4,
        ingredients: ['جبنة بيضاء', 'طماطم', 'زعتر', 'زيتون متبل', 'فلفل مشوي', 'خضروات طازجة'],
        image: 'https://images.pexels.com/photos/2452284/pexels-photo-2452284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 9,
        name: 'عصير مانجو طازج',
        description: 'مانجو بلدي طازج ١٠٠٪ بدون أي إضافات صناعية، يقدم مثلجاً مع شرائح المانجو',
        category: 'drinks',
        tags: ['veg', 'bestseller'],
        popular: true,
        badge: { type: 'bestseller', label: 'الأكثر مبيعاً' },
        prepTime: 5,
        calories: 210,
        rating: 4.9,
        ingredients: ['مانجو بلدي', 'ثلج مجروش', 'شرائح مانجو طازجة'],
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
        tags: ['veg'],
        popular: false,
        badge: { type: 'veg', label: 'نباتي' },
        prepTime: 5,
        calories: 120,
        rating: 4.6,
        ingredients: ['ليمون طازج', 'نعناع', 'ثلج مجروش', 'سكر'],
        image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 11,
        name: 'كوكتيل عصائر الدار',
        description: 'مزيج منعش من الفواكه الموسمية الطازجة مع لمسة من الليمون والنعناع',
        category: 'drinks',
        price: 55,
        tags: ['veg'],
        popular: false,
        badge: null,
        prepTime: 7,
        calories: 180,
        rating: 4.5,
        ingredients: ['فواكه موسمية', 'ليمون', 'نعناع', 'ثلج'],
        image: 'https://images.pexels.com/photos/36268520/pexels-photo-36268520.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      },
      {
        id: 12,
        name: 'شاورما الدار بالأرز',
        description: 'شرائح شاورما لحم متبلة على الطريقة الشامية مع أرز أبيض وبطاطس ذهبية وصوص الثومية',
        category: 'mains',
        price: 175,
        tags: [],
        popular: false,
        badge: null,
        prepTime: 22,
        calories: 890,
        rating: 4.7,
        ingredients: ['شاورما لحم', 'أرز أبيض', 'بطاطس ذهبية', 'ثومية', 'مخلل خيار'],
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
    const isMobileMenuOpen = ref(false);
    const selectedItem     = ref(null);
    const modalQty         = ref(1);
    const searchQuery      = ref('');
    const activeCategory   = ref('all');
    const activeFilters    = ref([]);

    const selectedSizes = reactive({});
    items.forEach((item) => {
      if (item.sizes) selectedSizes[item.id] = item.defaultSize || item.sizes[0].label;
    });

    /* ---------- Cart (order collection) ---------- */

    const RESTAURANT_WHATSAPP = '201280402765'; // رقم واتساب المطعم

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

    /* ---------- Lifecycle ---------- */

    onMounted(() => {
      // Preload the first hero slide, then dismiss the splash screen
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
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKeydown);
    });

    onBeforeUnmount(() => {
      stopSlider();
      stopReviewSlider();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeydown);
    });

    /* ---------- Navbar ---------- */

    const onScroll = () => { isScrolled.value = window.scrollY > 40; };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const goToCategory = (id) => {
      activeCategory.value = id;
      const target = document.getElementById('menu-section');
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    /* ---------- Product modal ---------- */

    const openItem = (item) => {
      selectedItem.value = item;
      modalQty.value = 1;
    };
    const closeItem = () => { selectedItem.value = null; };

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        if (selectedItem.value) { closeItem(); return; }
        if (isCartOpen.value)   { isCartOpen.value = false; return; }
        isMobileMenuOpen.value = false;
      }
    };

    // Lock body scroll while a modal/drawer is open
    watch([selectedItem, isCartOpen], ([item, cartOpen]) => {
      document.body.classList.toggle('no-scroll', !!item || cartOpen);
    });

    // Reset the checkout flow when the drawer closes or the cart empties
    watch(isCartOpen, (open) => {
      if (!open) checkoutStep.value = 'cart';
    });

    watch(cartCount, (count) => {
      if (count === 0) checkoutStep.value = 'cart';
    });

    /* ---------- Filtering actions ---------- */

    const toggleFilter = (id) => {
      const idx = activeFilters.value.indexOf(id);
      idx === -1 ? activeFilters.value.push(id) : activeFilters.value.splice(idx, 1);
    };

    const selectSize = (itemId, sizeLabel) => {
      selectedSizes[itemId] = sizeLabel;
    };

    const resetFilters = () => {
      searchQuery.value = '';
      activeCategory.value = 'all';
      activeFilters.value = [];
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

      return items.filter((item) => {
        if (activeCategory.value === 'popular') {
          if (!item.popular) return false;
        } else if (activeCategory.value !== 'all' && item.category !== activeCategory.value) {
          return false;
        }

        if (!activeFilters.value.every((f) => item.tags.includes(f))) return false;

        if (q && !normalize(item.name).includes(q) && !normalize(item.description).includes(q)) {
          return false;
        }

        return true;
      });
    });

    /* ---------- Pagination: 8 products per screen ---------- */

    const PAGE_SIZE = 8;
    const visibleCount = ref(PAGE_SIZE);

    const displayedItems = computed(() => filteredItems.value.slice(0, visibleCount.value));

    const showMore = () => { visibleCount.value += PAGE_SIZE; };

    // Reset pagination whenever the filters change
    watch([searchQuery, activeCategory, activeFilters], () => {
      visibleCount.value = PAGE_SIZE;
    }, { deep: true });

    // Item count per category tab (for the filter panel badges)
    const categoryCounts = computed(() => {
      const counts = {};
      categories.forEach((cat) => {
        if (cat.id === 'all') counts[cat.id] = items.length;
        else if (cat.id === 'popular') counts[cat.id] = items.filter((i) => i.popular).length;
        else counts[cat.id] = items.filter((i) => i.category === cat.id).length;
      });
      return counts;
    });

    const hasActiveFilters = computed(() =>
      !!searchQuery.value || activeCategory.value !== 'all' || activeFilters.value.length > 0
    );

    /* ---------- Helpers ---------- */

    const currentPrice = (item) => {
      if (!item.sizes) return item.price;
      const size = item.sizes.find((s) => s.label === selectedSizes[item.id]);
      return size ? size.price : item.sizes[0].price;
    };

    // Arabic-Indic numerals: 160 -> ١٦٠ / 4.7 -> ٤٫٧
    const formatPrice = (value) =>
      new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(value);

    return {
      // data
      categories, quickFilters, heroSlides,
      // state
      isLoading, isScrolled, isMobileMenuOpen,
      selectedItem, modalQty, searchQuery, activeCategory, activeFilters,
      selectedSizes, filteredItems, currentSlide,
      categoryCounts, hasActiveFilters,
      displayedItems, visibleCount, showMore,
      reviews, currentReview, reviewDirection, goToReview, nextReview, prevReview,
      feedback, feedbackErrors, hoverRating, submitFeedback,
      cart, isCartOpen, toast, cartCount, cartTotal,
      checkoutStep, orderType, customer, formErrors,
      // actions
      toggleFilter, selectSize, resetFilters,
      currentPrice, formatPrice,
      openItem, closeItem, scrollTop, goToCategory,
      goToSlide, nextSlide, prevSlide,
      addToCart, changeQty, removeLine, clearCart, checkout,
    };
  },
}).mount('#app');
