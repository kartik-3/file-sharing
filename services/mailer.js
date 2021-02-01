const sendMail = async (data) => {
  // https://file-sharing-app-kartik.herokuapp.com/email
  const response = await fetch("http://localhost:5000/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export default sendMail;

