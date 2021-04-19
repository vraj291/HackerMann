import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import './UserList.css'

export const UserList = (props) => {

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontSize : 'large',
            fontFamily : "'Saira Condensed', sans-serif"
        }
    });

    const classes = useStyles();

    return(
        <div className='userlist'>
            <div className='userlabel'>Currently Active: </div>
            {props.users.map((e,index) => 
                <div className='user' key={e}>
                    {props.typing[index] ? 
                        <div className='typing'>
                        </div>
                        :""
                    }
                    {e}
                </div>
            )}
        </div>
)}