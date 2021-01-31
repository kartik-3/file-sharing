import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import Storage from "@aws-amplify/storage";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_identityPoolId,
      region: process.env.REACT_APP_region,
      userPoolId: process.env.REACT_APP_userPoolId,
      userPoolWebClientId: process.env.REACT_APP_userPoolWebClientId,
    },
    Storage: {
      bucket: process.env.REACT_APP_bucket,
      identityPoolId: process.env.REACT_APP_identityPoolId,
      region: process.env.REACT_APP_region,
      // level: level,
    },
  });
}

export function SetS3Config(bucket, level) {
  Storage.configure({
    bucket: bucket,
    level: level,
    region: "ap-south-1",
    identityPoolId: process.env.REACT_APP_identityPoolId,
  });
}
