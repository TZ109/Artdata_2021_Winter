
/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
import React, { PureComponent,useState, useEffect,useLayoutEffect }  from "react";
import {BrowserRouter, Router, Switch, Route, Link} from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./board.css";
import { dev_ver } from '../../pages/global_const'
import axios from "axios";

function Editor({isLogin, isAdmin}){

    const [title,setTitle] = useState("")
    const [bodytext, setBodytext] = useState("")

    function upload()
    {
        var jsondata = {
            title : null,
            bodytext : null
        }


        if(title != undefined && title.length>=1)
        {
            jsondata.title = title
        }
        else
        {
            alert("제목을 입력하십시오.")
            return false
        }

        if(bodytext!=undefined && bodytext.length>=1)
        {
            jsondata.bodytext = bodytext
        }

        else
        {
            alert("내용을 입력하십시오.")
            return false
        }

        axios.post(`http://${dev_ver}:4000/api/notice/upload`,jsondata)
        .then((res)=>{
            if(res.data.login_required)
            {
                alert("로그인이 필요합니다.")
                window.location.href = '/loginPage'
            }
            else if(res.data.db_error){
                alert("등록에 실패하였습니다.")
            }
            else if(res.data.result)
            {
                alert("등록 되었습니다.")
                window.location.href = '/notice'
            }
            
            
        })
        .catch((err)=>{
           
            alert(err)
        })
        
    }

    
    function cancel()
    {
        history.back()
    }

    return(
        <>
        <div className="NoticeEditor_block">
                <div className="NoticeEditor_title">
                    <p>공지사항 작성</p>
                </div>
                <input className="title_input" onChange={(e)=>{setTitle(e.target.value)}} type='text' placeholder='제목을 입력해주세요.' />
                <div className="NoticeEditor">
                        <div className="form-wrapper">
                        <CKEditor
                            config={{placeholder:"내용을 입력해주세요"}}
                            editor={ClassicEditor}
                            data=""
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log({ event, editor, data });
                                setBodytext(editor.getData())
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                            />
                        </div>   
                </div>
                <div className="EditorFlex">
                            <button onClick={upload} className="submitButton">등록</button>
                            <button onClick={cancel} className="submitButton">취소</button>
                </div>
        </div>
        </>
    )
}

export default Editor;
