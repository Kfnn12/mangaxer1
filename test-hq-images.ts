async function testHQ() {
  const url1 = "https://i2.wp.com/manganow.to/manga/images/5974b1deba69da17_1717659011.webp?w=400&resize=300,400";
  const url2 = "https://manganow.to/manga/images/5974b1deba69da17_1717659011.webp"; // check original domain directly or without params

  const headers = {};
  
  try {
     const t1 = await fetch(url1);
     console.log("url1 size", t1.headers.get("content-length"));
     
     const t2 = await fetch(url1.split('?')[0]);
     console.log("url2 size", t2.headers.get("content-length"));
     
     const t3 = await fetch(url2);
     console.log("url3 size", t3.headers.get("content-length"));
  } catch (e) {
      console.error(e);
  }
}
testHQ();
