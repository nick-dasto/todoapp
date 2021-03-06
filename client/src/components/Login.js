import React , {useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { ToDoContext } from '../context/ToDoContext'
import axios from 'axios';
import { TextField, Button, Paper, makeStyles, Typography, 
    Snackbar, Container } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import image from "../assets/bkg.jpg"

const useStyles = makeStyles((theme) => ({
    bkg: {
        background: 'url(' + image + ') top center no-repeat',
        backgroundSize: 'cover',
        flexGrow: '1',
        maxWidth:'100vw',  
    },
    container:{
        background: 'rgba(255,255,255,0.80)',
        width: '100%',
        maxWidth: '45rem',
        padding: theme.spacing(2),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    form:{
        display:'flex',
        flexDirection: 'column'
    },
    textField:{
        margin: theme.spacing(1),
    },
}))

function Login() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);

    const { userData,setUserData, setSnackMessage } = useContext(ToDoContext);
    const history = useHistory();

    const submit = async (e) =>{
         e.preventDefault();
        try{
            const loginUser = { email,password }
            const loginRes = await axios.post("/api/v1/users/login", loginUser);
            setUserData({...userData, token: loginRes.data.token, user: loginRes.data.user});
            localStorage.setItem("x-auth-token", loginRes.data.token);
            setEmail('');
            setPassword('');
            history.push('/todos')
            setSnackMessage('Welcome back!')
        }catch(err){
            err.response && setError(err.response.data.msg)
        }
    }
    return (
        <Container className={classes.bkg}>
            <Paper className={classes.container}>
                <form onSubmit={submit} className={classes.form}>
                <Snackbar open={error !== undefined} anchorOrigin={{vertical:'top', horizontal:'center'}} 
                variant="filled" autoHideDuration={3000} onClose={() => setError(undefined)}>
                <Alert severity="error">{error}</Alert></Snackbar>
                <Typography variant='h3'>Login</Typography>
                <TextField className={classes.textField} variant="outlined" label="Email" type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField className={classes.textField} variant="outlined" label="Password" type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button className={classes.textField} variant="contained" color="primary" type='submit'>Login</Button>
                </form>
            </Paper>
        </Container>
    )
}

export default Login
