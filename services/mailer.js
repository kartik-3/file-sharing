const sendMail = async (data) => {
  const response = await fetch("https://file-sharing-app-kartik.herokuapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export default sendMail;
