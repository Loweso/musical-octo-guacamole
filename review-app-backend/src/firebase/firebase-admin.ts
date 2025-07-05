import * as admin from 'firebase-admin';
import * as serviceAccount from 'src/test-project-7946b-firebase-adminsdk-bp0bc-3018d83b09.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
