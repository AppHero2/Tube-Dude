// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,
    firebaseConfig:{
        apiKey: "AIzaSyC9_eGrZufcFVy0jS9Ytv-7RYvduZur91Q",
        authDomain: "tube-dude.firebaseapp.com",
        databaseURL: "https://tube-dude.firebaseio.com",
        projectId: "tube-dude",
        storageBucket: "",
        messagingSenderId: "67302929067"
    }
};
