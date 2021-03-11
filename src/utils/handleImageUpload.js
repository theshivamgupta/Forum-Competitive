async function handleImageUpload(image, uploadPreset = "forum-competitve") {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", uploadPreset);
  data.append("cloud_name", "dpjwgulmt");
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dpjwgulmt/image/upload",
    {
      method: "POST",
      accept: "application/json",
      body: data,
    }
  );
  const jsonResponse = await response.json();
  return jsonResponse.url;
}

export default handleImageUpload;
