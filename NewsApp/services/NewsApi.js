import axios from 'axios'

const API_KEY= '2b0c4bf5342748169d9615557b31d635';
const BASE_URL="https://newsapi.org/v2";
export const fetchNewsByCountry=async(country='us')=>{
  const response=await axios.get(`${BASE_URL}/top-headlines`,{
    params:{country,apiKey:API_KEY},
  });
  return response.data.articles;
}
export const fetchCategoryNews=async(category='general',page=1)=>{
  const res = await axios.get(
    `${BASE_URL}/top-headlines?country=us&category=${category}&pageSize=10&page=${page}&apiKey=${API_KEY}`
  );
  return res.data.articles;
}
export const getTopHeadlines = async (page = 1) => {
  const res = await axios.get(
    `${BASE_URL}/top-headlines?country=us&pageSize=10&page=${page}&apiKey=${API_KEY}`
  );
  return res.data.articles;
}
export const searchNews=async(searchKey)=>{
  const response=await axios.get(`${BASE_URL}/everything`,{
    params:{q:searchKey,apiKey:API_KEY},
  });
  return response.data.articles;
}
export const fetchNewsByKeyword = async (keyword) => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(keyword)}&apiKey=${API_KEY}`
    );
    const json = await response.json();
    return json.articles;
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    return [];
  }
};

export const getLatestNews =async()=>{
  try{
    const res=await axios.get( `${BASE_URL}/v2/top-headlines?country=us&apiKey=${API_KEY}`)
    const data=res.data;
    return data.articles?.[0];
  }catch(e){
    console.error(e);
    return null;
  }
}
