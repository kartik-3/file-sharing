import React, { useState } from "react";
import { render } from "react-dom";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";

import Storage from "@aws-amplify/storage";
import "regenerator-runtime/runtime";

import { configureAmplify, SetS3Config } from "../services/amplifyService";
import sendMail from "../services/mailer";

const emailRegVal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#cfd8dc",
    color: "#263238",
    height: "100vh",
  },
  title: {
    fontSize: 50,
    fontWeight: "bolder",
    textAlign: "center",
  },
  mtb5: {
    marginTop: 5,
    marginBottom: 5,
  },
}));

const App = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [response, setResponse] = useState();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [uploadSucces, setUploadSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState();

  const { register, handleSubmit, errors } = useForm();

  const classes = useStyles();
  const uploadFile = () => {
    SetS3Config(process.env.REACT_APP_bucket, "public");
    if (isFilePicked) {
      Storage.put(fileName, selectedFile, {
        contentType: fileType,
      })
        .then((result) => {
          setResponse("File uploaded successfully! Check your email for the link to the file.");
          setUploadSuccess(true);
          setIsFilePicked(false);
          setIsSubmitClicked(false);
          setFileName("Select another file");
          const newFileName = fileName.split(" ").join("+");
          const data = {
            fileName: newFileName,
            email: emailValue,
          };
          sendMail(data).then((response) => {
            if (response.status == 200) {
              alert("mail sent");
            }
          });
        })
        .catch((err) => setResponse(`Can not upload file: ${err}`));
    }
  };

  const onFileSelect = (e) => {
    setUploadSuccess(false);
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setFileType(e.target.files[0].type);
    setIsFilePicked(true);
  };

  const handleSubmitClicked = () => {
    setIsSubmitClicked(true);
  };

  const handleEmail = (e) => {
    setEmailValue(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spcaing={2}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item xs></Grid>
        <Grid item xs>
          <p className={classes.title}>Upload to Cloud!</p>
          <form onSubmit={handleSubmit(uploadFile)}>
            <p id="email-label">Enter your email ID</p>
            <TextField
              id="email"
              name="email"
              variant="outlined"
              placeholder="Enter your email ID"
              onChange={handleEmail}
              fullWidth
              inputRef={register({
                validate: {
                  reg: (value) => emailRegVal.test(String(value).toLowerCase()),
                },
              })}
            />
            {errors.email && errors.email.type === "reg" && (
              <Alert severity="error">Incorrect email ID!</Alert>
            )}
            {isFilePicked ? (
              <>
                <p id="selected-file">Selected file</p>
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  value={fileName}
                  fullWidth
                  variant="outlined"
                  className={classes.mtb5}
                />
              </>
            ) : (
              <></>
            )}
            <Button
              variant="contained"
              component="label"
              fullWidth
              className={classes.mtb5}
            >
              Select File
              <input type="file" onChange={onFileSelect} hidden />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmitClicked}
              type="submit"
              fullWidth
              className={classes.mtb5}
            >
              Submit
            </Button>
            {isSubmitClicked && !isFilePicked && (
              <Alert severity="warning">Select a file first!</Alert>
            )}
            {uploadSucces && <Alert severity="success">{response}</Alert>}
          </form>
        </Grid>
        <Grid item xs></Grid>
      </Grid>
    </div>
  );
};

configureAmplify();

render(<App />, document.querySelector("#react-root"));
