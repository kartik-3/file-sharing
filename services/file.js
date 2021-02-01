const sendFile = async (data) => {
  const formData = new FormData();
  formData.append("file", data);
  const response = await fetch("https://file-sharing-app-kartik.herokuapp.com/file", {
    body: formData,
    method: "PUT",
  });
  return response;
};

export default sendFile;
