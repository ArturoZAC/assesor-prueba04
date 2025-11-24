/*
export const config = {
  apiUrl: "https://api.assessorperu.com/api",
};
*/

const url = process.env.NEXT_PUBLIC_API_URL;

export const config = {
  apiUrl: url,
};

/*
export const config = {
  apiUrl: "https://server.assessorperu.com/api",
}
*/
