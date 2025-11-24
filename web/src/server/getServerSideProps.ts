
export async function getServerSideProps(url: string) {
  try {
    const res = await fetch(`https://apiaseso.logosperu.com.pe/api/${url}`, {
      cache: "no-store",
      credentials: 'include',
    });
    if (!res.ok) {
      return;
    }
   
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return;
    }
    const data = await res.json();
    console.log("DATA: ", data);
    return data;
  } catch (error) {
    console.log("error")
    console.log(error);
  }
}
