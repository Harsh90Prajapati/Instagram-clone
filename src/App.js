import React ,{ useState , useEffect }from 'react';
import './App.css';
import Post from './Post';
import { db ,auth } from './firebase';
import { makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts]= useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user,setUser] = useState(null);
   
  useEffect(()=>{
     const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null);
      }

      return()=>{
        unsubscribe();
      }

    })
  },[user, username]);


  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()})));
    })

   
  },[]);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) =>{
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }
  return (
    <div className="app">

      {/* login, Signin,SignUp feature........... */}
      
      <Modal
       open = {open}
       onClose ={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_form">
           <center>
             <img 
                className="app_headerimage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
           </center> 
           <Input
               placeholder="Username"
               type ="text"
                value= {username}
                onChange={(e) => setUsername(e.target.value)}              
              />
              <Input
                placeholder="email"
                type ="text"
                value= {email}
               onChange={(e) => setEmail(e.target.value)}              
              />
             <Input
               placeholder="Password"
               type ="password"
                value= {password}
               onChange={(e) => setPassword(e.target.value)}              
             />
             <Button type="submit" onClick={signUp}>Login</Button>       
          </form>           
        </div>       
      </Modal>

      <Modal
       open = {openSignIn}
       onClose ={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_form">
           <center>
             <img 
                className="app_headerimage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
           </center> 
            <Input
              placeholder="email"
              type ="text"
              value= {email}
              onChange={(e) => setEmail(e.target.value)}              
             />
            <Input
              placeholder="Password"
              type ="password"
              value= {password}
              onChange={(e) => setPassword(e.target.value)}              
           />
            <Button type="submit" onClick={signIn}>Sign IN</Button>       
         </form>           
        </div>       
      </Modal>

     {/*Header*/}

     <div className="app_header">
         <img className="app_headerimage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt=""
       />
       {user? (
       <Button onClick={()=> auth.signOut()}>LogOut</Button>
       ):(
       <div className="app_loginContainor">
        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={() => setOpen(true)}>Sign Up</Button>
       </div>    
        )}
     </div>
     
     
     {/* uploading feature........... */}
     
     {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Login to Upload</h3>
      )}

      {/* posts................. */}

      <div className="app_posts">
        <div className="app_postLeft">
          {
            posts.map(({id,post}) =>(
             <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))
          }
        </div>
        <div className="app_postRight">
         <InstagramEmbed
            url='https://www.instagram.com/p/CIxaJ3OHNpKqJ3bEr4y2x09GuNVqPgog6tajfk0/'
            clientAccessToken='<appId>|<clientToken>'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />  
        </div>    
      </div>
     
    </div>
  );
}

export default App;
