/**
 * App Loader
 * The goal of this loader is to dynamically
 * load the component needed in the frame child
 * It takes one param the actual appName to be loaded
 * from the footer
 * Few rules:
 * An application must be place in his own folder in the Applications folder
 * The Folder's Name must be the same that the associated component **see config/application**
 */
class AppLoader {
  constructor(appName) {
    this.appName = appName;
  }
  applicationSelector = async () => {
    if (this.appName) {
      try {
        const app = await import(`../${this.appName}/containers/index.js`);
        return app.default;
      }
      catch (error) {
        console.log(error);
        throw new Error(`Unable to import app: ${error.message}`);
      }
    }
    return false;
  }
}

export default AppLoader;
