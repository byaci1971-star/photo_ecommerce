export type Language = 'fr' | 'de' | 'en' | 'ar';

export const languages: Record<Language, string> = {
  fr: 'Français',
  de: 'Deutsch',
  en: 'English',
  ar: 'العربية',
};

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.cart': 'Panier',
    'nav.account': 'Compte',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',

    // Home page
    'home.title': 'Créer de beaux produits photo',
    'home.subtitle': 'Transformez vos souvenirs en magnifiques livres photo, calendriers et bien plus',
    'home.cta': 'Commencer à créer',
    'home.features.quality': 'Qualité Premium',
    'home.features.quality.desc': 'Qualité d\'impression primée',
    'home.features.shipping': 'Livraison Rapide',
    'home.features.shipping.desc': 'Livraison rapide à votre porte',
    'home.features.satisfaction': 'Satisfaction Garantie',
    'home.features.satisfaction.desc': 'Garantie de satisfaction 100%',
    'home.features.easy': 'Facile à Utiliser',
    'home.features.easy.desc': 'Outils de conception simples',
    'home.our_products': 'Nos Produits',
    'home.featured': 'Produits en Vedette',

    // Products
    'products.photo_books': 'Livres Photo',
    'products.calendars': 'Calendriers',
    'products.prints': 'Tirages',
    'products.greeting_cards': 'Cartes de Voeux',
    'products.add_to_cart': 'Ajouter au panier',
    'products.price': 'CHF {price}',
    'products.in_stock': 'En stock',
    'products.out_of_stock': 'Rupture de stock',

    // Cart
    'cart.title': 'Panier d\'achat',
    'cart.empty': 'Votre panier est vide',
    'cart.subtotal': 'Sous-total:',
    'cart.shipping': 'Livraison:',
    'cart.total': 'Total:',
    'cart.checkout': 'Procéder au paiement',
    'cart.continue_shopping': 'Continuer vos achats',
    'cart.remove': 'Supprimer',
    'cart.clear': 'Vider le panier',
    'cart.quantity': 'Quantité:',

    // Checkout
    'checkout.title': 'Paiement',
    'checkout.shipping_address': 'Adresse de livraison',
    'checkout.billing_address': 'Adresse de facturation',
    'checkout.same_as_shipping': 'Identique à l\'adresse de livraison',
    'checkout.payment_method': 'Méthode de paiement',
    'checkout.credit_card': 'Carte de crédit',
    'checkout.paypal': 'PayPal',
    'checkout.order_summary': 'Résumé de la commande',
    'checkout.place_order': 'Passer la commande',
    'checkout.cancel': 'Annuler',

    // Account
    'account.title': 'Mon Compte',
    'account.profile': 'Profil',
    'account.orders': 'Mes Commandes',
    'account.addresses': 'Adresses',
    'account.settings': 'Paramètres',
    'account.logout': 'Déconnexion',
    'account.order_history': 'Historique des commandes',
    'account.order_date': 'Date de commande:',
    'account.order_status': 'Statut:',
    'account.order_total': 'Total:',
    'account.view_details': 'Voir les détails',

    // Messages
    'message.added_to_cart': 'Produit ajouté au panier!',
    'message.please_login': 'Veuillez vous connecter pour ajouter des articles à votre panier.',
    'message.error': 'Erreur',
    'message.success': 'Succès',

    // Footer
    'footer.about': 'À propos',
    'footer.support': 'Support',
    'footer.legal': 'Juridique',
    'footer.follow': 'Nous suivre',
    'footer.copyright': '© 2025 Photo E-Commerce Platform. Tous droits réservés.',
  },

  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.cart': 'Warenkorb',
    'nav.account': 'Konto',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',

    // Home page
    'home.title': 'Erstellen Sie wunderschöne Fotoprodukte',
    'home.subtitle': 'Verwandeln Sie Ihre Erinnerungen in wunderschöne Fotobücher, Kalender und vieles mehr',
    'home.cta': 'Jetzt erstellen',
    'home.features.quality': 'Premium-Qualität',
    'home.features.quality.desc': 'Preisgekrönte Druckqualität',
    'home.features.shipping': 'Schneller Versand',
    'home.features.shipping.desc': 'Schnelle Lieferung an Ihre Tür',
    'home.features.satisfaction': 'Zufriedenheitsgarantie',
    'home.features.satisfaction.desc': '100% Zufriedenheitsgarantie',
    'home.features.easy': 'Einfach zu bedienen',
    'home.features.easy.desc': 'Einfache Designwerkzeuge',
    'home.our_products': 'Unsere Produkte',
    'home.featured': 'Empfohlene Produkte',

    // Products
    'products.photo_books': 'Fotobücher',
    'products.calendars': 'Kalender',
    'products.prints': 'Drucke',
    'products.greeting_cards': 'Grußkarten',
    'products.add_to_cart': 'In den Warenkorb',
    'products.price': 'CHF {price}',
    'products.in_stock': 'Auf Lager',
    'products.out_of_stock': 'Ausverkauft',

    // Cart
    'cart.title': 'Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.subtotal': 'Zwischensumme:',
    'cart.shipping': 'Versand:',
    'cart.total': 'Gesamt:',
    'cart.checkout': 'Zur Kasse',
    'cart.continue_shopping': 'Weiter einkaufen',
    'cart.remove': 'Entfernen',
    'cart.clear': 'Warenkorb leeren',
    'cart.quantity': 'Menge:',

    // Checkout
    'checkout.title': 'Kasse',
    'checkout.shipping_address': 'Lieferadresse',
    'checkout.billing_address': 'Rechnungsadresse',
    'checkout.same_as_shipping': 'Gleich wie Lieferadresse',
    'checkout.payment_method': 'Zahlungsart',
    'checkout.credit_card': 'Kreditkarte',
    'checkout.paypal': 'PayPal',
    'checkout.order_summary': 'Bestellübersicht',
    'checkout.place_order': 'Bestellung aufgeben',
    'checkout.cancel': 'Abbrechen',

    // Account
    'account.title': 'Mein Konto',
    'account.profile': 'Profil',
    'account.orders': 'Meine Bestellungen',
    'account.addresses': 'Adressen',
    'account.settings': 'Einstellungen',
    'account.logout': 'Abmelden',
    'account.order_history': 'Bestellverlauf',
    'account.order_date': 'Bestelldatum:',
    'account.order_status': 'Status:',
    'account.order_total': 'Gesamt:',
    'account.view_details': 'Details anzeigen',

    // Messages
    'message.added_to_cart': 'Produkt zum Warenkorb hinzugefügt!',
    'message.please_login': 'Bitte melden Sie sich an, um Artikel in Ihren Warenkorb zu legen.',
    'message.error': 'Fehler',
    'message.success': 'Erfolg',

    // Footer
    'footer.about': 'Über uns',
    'footer.support': 'Unterstützung',
    'footer.legal': 'Rechtliches',
    'footer.follow': 'Folgen Sie uns',
    'footer.copyright': '© 2025 Photo E-Commerce Platform. Alle Rechte vorbehalten.',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.login': 'Login',

    // Home page
    'home.title': 'Create Beautiful Photo Products',
    'home.subtitle': 'Transform your memories into stunning photo books, calendars, and more',
    'home.cta': 'Start Creating',
    'home.features.quality': 'Premium Quality',
    'home.features.quality.desc': 'Award-winning print quality',
    'home.features.shipping': 'Fast Shipping',
    'home.features.shipping.desc': 'Quick delivery to your door',
    'home.features.satisfaction': 'Satisfaction Guaranteed',
    'home.features.satisfaction.desc': '100% satisfaction promise',
    'home.features.easy': 'Easy to Use',
    'home.features.easy.desc': 'Simple design tools',
    'home.our_products': 'Our Products',
    'home.featured': 'Featured Products',

    // Products
    'products.photo_books': 'Photo Books',
    'products.calendars': 'Calendars',
    'products.prints': 'Prints',
    'products.greeting_cards': 'Greeting Cards',
    'products.add_to_cart': 'Add to Cart',
    'products.price': 'CHF {price}',
    'products.in_stock': 'In Stock',
    'products.out_of_stock': 'Out of Stock',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal:',
    'cart.shipping': 'Shipping:',
    'cart.total': 'Total:',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.clear': 'Clear Cart',
    'cart.quantity': 'Quantity:',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping_address': 'Shipping Address',
    'checkout.billing_address': 'Billing Address',
    'checkout.same_as_shipping': 'Same as shipping address',
    'checkout.payment_method': 'Payment Method',
    'checkout.credit_card': 'Credit Card',
    'checkout.paypal': 'PayPal',
    'checkout.order_summary': 'Order Summary',
    'checkout.place_order': 'Place Order',
    'checkout.cancel': 'Cancel',

    // Account
    'account.title': 'My Account',
    'account.profile': 'Profile',
    'account.orders': 'My Orders',
    'account.addresses': 'Addresses',
    'account.settings': 'Settings',
    'account.logout': 'Logout',
    'account.order_history': 'Order History',
    'account.order_date': 'Order Date:',
    'account.order_status': 'Status:',
    'account.order_total': 'Total:',
    'account.view_details': 'View Details',

    // Messages
    'message.added_to_cart': 'Product added to cart!',
    'message.please_login': 'Please log in to add items to your cart.',
    'message.error': 'Error',
    'message.success': 'Success',

    // Footer
    'footer.about': 'About',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.follow': 'Follow Us',
    'footer.copyright': '© 2025 Photo E-Commerce Platform. All rights reserved.',
  },

  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.cart': 'سلة التسوق',
    'nav.account': 'الحساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',

    // Home page
    'home.title': 'إنشاء منتجات صور جميلة',
    'home.subtitle': 'حول ذكرياتك إلى كتب صور مذهلة وتقويمات وأكثر',
    'home.cta': 'ابدأ الإنشاء',
    'home.features.quality': 'جودة عالية',
    'home.features.quality.desc': 'جودة طباعة حائزة على جوائز',
    'home.features.shipping': 'شحن سريع',
    'home.features.shipping.desc': 'توصيل سريع إلى باب منزلك',
    'home.features.satisfaction': 'ضمان الرضا',
    'home.features.satisfaction.desc': 'ضمان رضا 100٪',
    'home.features.easy': 'سهل الاستخدام',
    'home.features.easy.desc': 'أدوات تصميم بسيطة',
    'home.our_products': 'منتجاتنا',
    'home.featured': 'المنتجات المميزة',

    // Products
    'products.photo_books': 'كتب الصور',
    'products.calendars': 'التقويمات',
    'products.prints': 'الطباعات',
    'products.greeting_cards': 'بطاقات المعايدة',
    'products.add_to_cart': 'أضف إلى السلة',
    'products.price': 'CHF {price}',
    'products.in_stock': 'متوفر',
    'products.out_of_stock': 'غير متوفر',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.subtotal': 'المجموع الجزئي:',
    'cart.shipping': 'الشحن:',
    'cart.total': 'الإجمالي:',
    'cart.checkout': 'المتابعة إلى الدفع',
    'cart.continue_shopping': 'متابعة التسوق',
    'cart.remove': 'إزالة',
    'cart.clear': 'مسح السلة',
    'cart.quantity': 'الكمية:',

    // Checkout
    'checkout.title': 'الدفع',
    'checkout.shipping_address': 'عنوان الشحن',
    'checkout.billing_address': 'عنوان الفاتورة',
    'checkout.same_as_shipping': 'نفس عنوان الشحن',
    'checkout.payment_method': 'طريقة الدفع',
    'checkout.credit_card': 'بطاقة ائتمان',
    'checkout.paypal': 'PayPal',
    'checkout.order_summary': 'ملخص الطلب',
    'checkout.place_order': 'تقديم الطلب',
    'checkout.cancel': 'إلغاء',

    // Account
    'account.title': 'حسابي',
    'account.profile': 'الملف الشخصي',
    'account.orders': 'طلباتي',
    'account.addresses': 'العناوين',
    'account.settings': 'الإعدادات',
    'account.logout': 'تسجيل الخروج',
    'account.order_history': 'سجل الطلبات',
    'account.order_date': 'تاريخ الطلب:',
    'account.order_status': 'الحالة:',
    'account.order_total': 'الإجمالي:',
    'account.view_details': 'عرض التفاصيل',

    // Messages
    'message.added_to_cart': 'تمت إضافة المنتج إلى السلة!',
    'message.please_login': 'يرجى تسجيل الدخول لإضافة عناصر إلى سلتك.',
    'message.error': 'خطأ',
    'message.success': 'نجاح',

    // Footer
    'footer.about': 'حول',
    'footer.support': 'الدعم',
    'footer.legal': 'القانوني',
    'footer.follow': 'تابعنا',
    'footer.copyright': '© 2025 Photo E-Commerce Platform. جميع الحقوق محفوظة.',
  },
};

export function t(key: string, language: Language, params?: Record<string, string>): string {
  let text = translations[language][key] || translations.en[key] || key;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value);
    });
  }
  
  return text;
}
