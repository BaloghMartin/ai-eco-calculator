const FUNNY_PRESET_SCENARIOS = [
    // --- LIGHT MODELLEK (6 db) ---
    { model: "light", media: "none", context: "none", prompt: "Írj egy agresszív, de passzív-agresszív bocsánatkérő emailt a szomszédnak, amiért a kutyám átjárt a kertjébe, de igazából az ő kertje volt a provokatív." },
    { model: "light", media: "none", context: "none", prompt: "Kérlek, magyarázd el úgy a kvantumfizikát, mintha egy részeg nagybácsi lennél egy lagziban, aki épp most borította magára a pörköltet." },
    { model: "light", media: "none", context: "none", prompt: "Írj egy motivációs beszédet egy olyan szobanövény szemszögéből, akit már három hete elfelejtettek meglocsolni, de még tartja magát." },
    { model: "light", media: "video", context: "none", prompt: "Generálj egy 5 másodperces drámai videót arról, ahogy egy galamb megpróbál megenni egy eldobott lángost, de a szél folyamatosan arrébb fújja." },
    { model: "light", media: "video", context: "none", prompt: "Készíts egy lassított felvételt egy programozóról, aki épp rájön, hogy az elmúlt 3 órában a 'production' adatbázist törölte." },
    { model: "light", media: "video", context: "none", prompt: "Videó egy macskáról, aki egy Roomba porszívón ülve királyként végigvonul a nappalin, miközben epikus zene szól." },

    // --- MEDIUM MODELLEK (6 db) ---
    { model: "medium", media: "none", context: "pdf_small", prompt: "Foglald össze nekem 5 vázlatpontban ezt a NAV útmutatót úgy, mintha egy nagyon lelkes, de kicsit buta golden retriever magyarázná." },
    { model: "medium", media: "none", context: "pdf_small", prompt: "Elemezd ezt a 15 oldalas társasházi közgyűlési jegyzőkönyvet, és emeld ki, melyik szomszéd tűnik a legvalószínűbb sorozatgyilkosnak a panaszai alapján." },
    { model: "medium", media: "none", context: "pdf_small", prompt: "Olvasd el ezt a mosógép használati utasítást, és írj belőle egy görög drámát, ahol a félpár zoknik elvesztése az istenek büntetése." },
    { model: "medium", media: "podcast", context: "article", prompt: "Készíts egy true crime stílusú podcast epizódot ebből a hírblokkból arról, hogy valaki ellopta a munkahelyi hűtőből a felcímkézett joghurtomat." },
    { model: "medium", media: "podcast", context: "article", prompt: "Alakítsd ezt a unalmas heti IT státuszjelentést egy izgalmas, sportközvetítés-jellegű podcasttá, ahol a határidők elleni küzdelem a fő meccs." },
    { model: "medium", media: "podcast", context: "article", prompt: "Ebből a Wikipédia cikkből a kacsákról csinálj egy drámai, kétszemélyes podcastot, ahol az egyik műsorvezető retteg tőlük." },

    // --- THINKING MODELLEK (18 db) ---
    { model: "thinking", media: "none", context: "none", prompt: "Írj egy részletes, tudományos pszichológiai elemzést arról, miért érzi úgy a macskám, hogy hajnali 3-kor kell énekelnie a falnak." },
    { model: "thinking", media: "none", context: "none", prompt: "Fejtsd vissza a kávégépünk hibakódjait, majd írj egy 5 felvonásos Shakespeare-i drámát arról, ahogy a gép megtagadja a tejet a főnöktől." },
    { model: "thinking", media: "none", context: "none", prompt: "Magyarázd el a húrelméletet egy olyan tinédzser szókincsével, aki minden mondatába beleteszi, hogy 'bruh' és 'literally', de szakmailag maradj 100%-ig pontos." },
    
    { model: "thinking", media: "video", context: "pdf_small", prompt: "Elemezd ezt a 10 oldalas meeting jegyzőkönyvet, találd meg azt a pontot, ahol mindenki feladta az életet, és készíts róla egy drámai anime küzdelmi jelenetet videón!" },
    { model: "thinking", media: "video", context: "pdf_small", prompt: "Elemezd az idei költségvetési tervezetemet (8 oldal), és csinálj egy katasztrófafilm-részletet videón arról a pillanatról, amikor meglátom a hóvégi bankszámla-egyenlegemet." },
    { model: "thinking", media: "video", context: "pdf_small", prompt: "Olvasd végig a suli házirendjét, és csinálj egy akcióvideót, amiben egy diák Matrix-stílusban kerüli ki a folyosói futás tilalmát." },
    
    { model: "thinking", media: "image", context: "pdf_large", prompt: "Olvasd át ezt a 100 oldalas szoftverarchitektúra dokumentációt, és rajzolj belőle egy térképet, ami úgy néz ki, mint egy vidámpark, ami épp most gyulladt ki." },
    { model: "thinking", media: "image", context: "pdf_large", prompt: "Elemezd ezt a 150 oldalas adótörvény-módosítást, és generálj egy fotorealisztikus képet egy könyvelőről, aki épp eggyé válik a kávéfőzőjével." },
    { model: "thinking", media: "image", context: "pdf_large", prompt: "Keresd ki a legbonyolultabb jogi csavart ebből a szerződésből, és készíts róla egy MC Escher stílusú végtelen lépcsős optikai illúziót festményként." },
    
    { model: "thinking", media: "video", context: "pdf_large", prompt: "Olvasd el az Európai Unió mezőgazdasági irányelveit (120 oldal), és készíts egy akciófilm előzetest, ahol a főhős egy lázadó uborka, aki nem hajlandó meggörbülni." },
    { model: "thinking", media: "video", context: "pdf_large", prompt: "A csatolt 200 oldalas orvosi műhibaperekből generálj egy 10 másodperces sitcom introt, 80-as évekbeli alánevetéssel és vidám zenével." },
    { model: "thinking", media: "video", context: "pdf_large", prompt: "Elemezd a 150 oldalas vállalati HR kézikönyvet, és csinálj egy horrorfilm trailert a 'Kötelező Pénteki Csapatépítő' címmel." },
    
    { model: "thinking", media: "image", context: "book", prompt: "Elemezd a Biblia Ószövetségét, és rajzolj egy abszurd infografikát arról, hogy melyik prófétának volt a legrosszabb napja, üzleti KPI-ok alapján." },
    { model: "thinking", media: "image", context: "book", prompt: "Olvasd el A Gyűrűk Urát, és készíts egy ingatlanügynöki prospektus borítót Mordorról, kiemelve a remek vulkanikus panorámát." },
    { model: "thinking", media: "image", context: "book", prompt: "Dolgozd fel a teljes Dosztojevszkij életművet, és generálj egy 'Live Laugh Love' stílusú, motivációs falmatricát Bűn és Bűnhődés idézetekkel." },
    
    { model: "thinking", media: "podcast", context: "book", prompt: "Olvasd fel nekem Az ember tragédiáját egy podcastban, de Madách Imre és Lucifer folyamatosan vitatkoznak azon, hogy kinek a hibája volt a globális felmelegedés." },
    { model: "thinking", media: "podcast", context: "book", prompt: "Foglald össze a Háború és Békét egy olyan podcast epizódként, ahol két túlpörgetett beauty vlogger pletykál a bálokról." },
    { model: "thinking", media: "podcast", context: "book", prompt: "Elemezd a Szürke Ötven Árnyalatát, és csinálj belőle egy halálosan komoly barkács- és lakberendezési podcastot a szoba hangszigeteléséről." }
];
