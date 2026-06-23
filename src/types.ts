/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StarMessage {
  id: string;
  title: string;
  message: string;
  color: string;
  x: number;
  y: number;
  z: number;
  size: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  urduDescription: string;
  icon: string;
  color: string;
}

export interface LoveReason {
  id: string;
  text: string;
  urduText?: string;
}

export const ROMANTIC_TITLES = [
  { text: "Meri Malkan 👑", subtitle: "The Sovereign of My Heart" },
  { text: "Meri Begam ❤️", subtitle: "My Wife, My Home, My Destiny" },
  { text: "Meri Janu 🌹", subtitle: "The Sweetness of My Soul" },
  { text: "Meri Jaan ✨", subtitle: "My Life, My Every Breath" },
  { text: "Meri Lakht-e-Jigar 💖", subtitle: "A Piece of My Heart" },
  { text: "Meri Antal Hayat 💕", subtitle: "My Eternal Lifetime Companion" },
  { text: "Mera Sakoon 🌙", subtitle: "The Quiet Calm in My Chaos" },
  { text: "Mera Bacha 🥺", subtitle: "My Precious, Most Adored Little One" }
];

export const STAR_MESSAGES: StarMessage[] = [
  {
    id: "star-1",
    title: "Madam G",
    message: "Tum meri zindagi ka sabse khoobsurat faisla ho. Jab se tum aayi ho, zindagi dharakne lagi hai.",
    color: "#ff758c",
    x: -120, y: 50, z: -80,
    size: 15
  },
  {
    id: "star-2",
    title: "Meri Malkan",
    message: "Tum sirf mere dil ki rani nahi, tum is poori kainaat mein mere liye sabse unche maqam par ho.",
    color: "#e2b0ff",
    x: 100, y: -70, z: -120,
    size: 18
  },
  {
    id: "star-3",
    title: "Meri Begam",
    message: "Ghar tumse hai, sukoon tumse hai. Tumhare bina har rasta adhoora aur har manzil be-maana hai.",
    color: "#ff7eb3",
    x: -80, y: -110, z: 60,
    size: 16
  },
  {
    id: "star-4",
    title: "Meri Jaan",
    message: "Tumhari ek muskurahat meri poori duniya ko roshan kar deti hai. Tum ho to main hoon.",
    color: "#ffd269",
    x: 150, y: 120, z: -50,
    size: 14
  },
  {
    id: "star-5",
    title: "Lakht-e-Jigar",
    message: "Tum mere dil ka hissa nahi, mera dil khud tumhari mohabbat se dharakta hai.",
    color: "#ff9a9e",
    x: -180, y: -40, z: -150,
    size: 15
  },
  {
    id: "star-6",
    title: "Antal Hayat",
    message: "Antal Hayat... Meri poori zindagi. Khuda se mangi hui har dua ka sabse behtareen jawab ho tum.",
    color: "#a1c4fd",
    x: 80, y: 80, z: 120,
    size: 17
  },
  {
    id: "star-7",
    title: "Mera Sakoon",
    message: "Duniyan ki sari thakan, pareshaniyan, aur fikar... tumhare pass aate hi ek sukoon mein badal jaati hain.",
    color: "#c3cfe2",
    x: -40, y: 140, z: -100,
    size: 16
  },
  {
    id: "star-8",
    title: "Mera Bacha",
    message: "Tumhari ye masoomiyat, ye thoda sa nakhra, ye pyaari baatein... mere liye duniya ki sabse keemti cheez hain.",
    color: "#fbc2eb",
    x: 120, y: -130, z: 90,
    size: 14
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "t-1",
    title: "Pehli Mulaqat",
    urduTitle: "پہلی ملاقات",
    description: "The divine moment when our worlds collided. A glance that silently rewrote my entire future.",
    urduDescription: "وہ لمحہ جب ہمارے راستے ملے، اور میری تقدیر نے ہمیشہ کے لیے ایک نیا رخ لے لیا۔",
    icon: "sparkles",
    color: "from-amber-400 via-rose-400 to-pink-500"
  },
  {
    id: "t-2",
    title: "Pehli Baat",
    urduTitle: "پہلی بات",
    description: "Our first conversation. Hearing your voice was like discovering a melody my heart had been huming since eternity.",
    urduDescription: "ہماری پہلی گفتگو۔ تمہاری آواز سننا ایسا تھا جیسے صدیوں کی ادھوری پیاس بجھ جانا۔",
    icon: "message-circle",
    color: "from-pink-500 via-rose-500 to-purple-600"
  },
  {
    id: "t-3",
    title: "Pehli Muskurahat",
    urduTitle: "پہلی مسکراہٹ",
    description: "That breathtaking smile of yours. It felt as if a thousand stars ignited in my chest all at once.",
    urduDescription: "تمہاری وہ پہلی مسکراہٹ جس نے میرے دل کے اندھیروں کو ہمیشہ کے لیے دور کر دیا۔",
    icon: "smile",
    color: "from-purple-600 via-indigo-500 to-blue-500"
  },
  {
    id: "t-4",
    title: "Pehla Pyar",
    urduTitle: "پہلا پیار",
    description: "The realization that you are not just someone I love, but the very definition of love itself for me.",
    urduDescription: "وہ سچائی کہ محبت صرف ایک احساس نہیں، محبت کا دوسرا نام تم ہو۔",
    icon: "heart",
    color: "from-blue-500 via-teal-400 to-emerald-500"
  },
  {
    id: "t-5",
    title: "Sabse Khoobsurat Yaad",
    urduTitle: "سب سے خوبصورت یاد",
    description: "Every quiet second holding your hand, sharing silences, knowing we are anchored in each other.",
    urduDescription: "وہ خاموش لمحے جب تمہارا ہاتھ میرے ہاتھ میں ہوتا ہے، اور وقت جیسے رک جاتا ہے۔",
    icon: "star",
    color: "from-emerald-400 via-yellow-400 to-rose-400"
  },
  {
    id: "t-6",
    title: "Hamari Kahani",
    urduTitle: "ہماری کہانی",
    description: "An ongoing masterpiece written in the ink of respect, adoration, shared laughter, and endless care.",
    urduDescription: "ہماری کہانی جو وفاداری، محبت اور لا محدود احترام کے خوبصورت دھاگوں سے بنی جا رہی ہے۔",
    icon: "book-open",
    color: "from-rose-400 via-pink-500 to-red-500"
  },
  {
    id: "t-7",
    title: "Hamare Sapne",
    urduTitle: "ہمارے سپنے",
    description: "Building castles of hope together, dreaming of simple mornings, warm evenings, and a lifetime of together.",
    urduDescription: "ہماری آنکھوں میں سجے ہوئے وہ پیارے خواب جنہیں ہم مل کر حقیقت کا روپ دے رہے ہیں۔",
    icon: "cloud-moon",
    color: "from-red-500 via-purple-600 to-fuchsia-500"
  },
  {
    id: "t-8",
    title: "Hamara Mustaqbil",
    urduTitle: "ہمارا مستقبل",
    description: "Growing old together, counting gray hairs, smiling at our memories, holding hands until the final breath.",
    urduDescription: "ہمارا خوبصورت مستقبل جہاں ہم جھریاں پڑنے تک ایک دوسرے کے ساتھ مسکرائیں گے اور ہاتھ تھامے رہیں گے۔",
    icon: "shield-check",
    color: "from-fuchsia-500 via-rose-500 to-amber-500"
  }
];

export const INFINITE_REASONS: LoveReason[] = [
  { id: "r-1", text: "Because you make my darkest days feel instantly bright.", urduText: "کیونکہ تم میرے اندھیروں کو روشنی میں بدل دیتی ہو۔" },
  { id: "r-2", text: "Because your smile changes the entire frequency of my world.", urduText: "کیونکہ تمہاری مسکراہٹ میری کائنات کا رخ بدل دیتی ہے۔" },
  { id: "r-3", text: "Because home is no longer a physical place; it is wherever you are.", urduText: "کیونکہ اب میرا گھر کوئی جگہ نہیں، بلکہ تم ہو جہاں بھی تم ہو۔" },
  { id: "r-4", text: "Because every version of my future is completely meaningless without you.", urduText: "کیونکہ تمہارے بغیر میرے مستقبل کا ہر نقشہ ادھورا ہے۔" },
  { id: "r-5", text: "Because loving you is the easiest, most natural thing I have ever done.", urduText: "کیونکہ تم سے محبت کرنا دنیا کا سب سے خوبصورت اور آسان کام ہے۔" },
  { id: "r-6", text: "Because the sound of your laughter is my absolute favorite song.", urduText: "کیونکہ تمہاری ہنسی کی آواز میرا سب سے پسندیدہ راگ ہے۔" },
  { id: "r-7", text: "Because you look at me with eyes that make me believe in magic.", urduText: "کیونکہ تمہاری آنکھیں مجھے معجزوں پر یقین دلاتی ہیں۔" },
  { id: "r-8", text: "Because you know my silence better than anyone knows my words.", urduText: "کیونکہ تم میری خاموشی کو بھی سمجھ لیتی ہو۔" },
  { id: "r-9", text: "Because your kindness teaches me how to be a better human being.", urduText: "کیونکہ تمہاری نرم دلی مجھے ایک بہتر انسان بننا سکھاتی ہے۔" },
  { id: "r-10", text: "Because of the gentle way you hold my heart as if it were glass.", urduText: "کیونکہ تم میرے دل کو اتنی نزاکت سے سنبھالتی ہو۔" },
  { id: "r-11", text: "Because you have accepted all my flaws and turned them into love.", urduText: "کیونکہ تم نے میری خامیوں کو بھی اپنی محبت سے سجا دیا۔" },
  { id: "r-12", text: "Because with you, I can be my absolute truest self without fear.", urduText: "کیونکہ تمہارے ساتھ میں بنا کسی ڈر کے خود کو پیش کر سکتا ہوں۔" },
  { id: "r-13", text: "Because of the way you care about the smallest details of my day.", urduText: "کیونکہ تم میری چھوٹی چھوٹی خوشیوں کا خیال رکھتی ہو۔" },
  { id: "r-14", text: "Because you are my prayer that got answered in the most beautiful way.", urduText: "کیونکہ تم میری وہ دعا ہو جو سب سے خوبصورت انداز میں قبول ہوئی۔" },
  { id: "r-15", text: "Because your embrace has the power to melt away any fatigue or pain.", urduText: "کیونکہ تمہاری آغوش میں دنیا کے سارے درد مٹ جاتے ہیں۔" },
  { id: "r-16", text: "Because your voice brings an instant, warm calm to my mind.", urduText: "کیونکہ تمہاری گفتگو میرے دماغ کو فورا سکون بخشتی ہے۔" },
  { id: "r-17", text: "Because you are the very first and absolute last thought of my day.", urduText: "کیونکہ تم میرے دن کی پہلی سوچ اور رات کا آخری خیال ہو۔" },
  { id: "r-18", text: "Because you are not just my wife, but my best friend and soulmate.", urduText: "کیونکہ تم صرف میری شریک حیات نہیں، میری سب سے اچھی دوست ہو۔" },
  { id: "r-19", text: "Because I love who I am when I am with you.", urduText: "کیونکہ مجھے خود سے محبت ہو جاتی ہے جب میں تمہارے ساتھ ہوتا ہوں۔" },
  { id: "r-20", text: "Because you are, quite simply, my entire universe.", urduText: "کیونکہ تم، بہت سادگی سے، میری پوری کائنات ہو۔" }
];
