<!DOCTYPE html>
<html>
    <head>
        <title>Login Page for Examples</title>
    </head>
    
    <body style="background-color:lightgray;">
        <div id="idDiv1" style="text-align:center;width:600px;
     height:400px;
     background-color:white;
     margin-left:auto;
     margin-right:auto;
     border:1px solid black;
     padding:20px;">
            <br>
            <br>    
            <h2>Login page</h2>
            <br>                                             
            <form method="POST" action="j_security_check">
                <table border="0" cellspacing="5" style="margin-left:auto;margin-right:auto;">
                    <tr>
                        <th align="right">Username:</th>
                        <td align="left"><input type="text" name="j_username"></td>
                    </tr>
                    <tr>
                        <th align="right">Password:</th>
                        <td align="left"><input type="password" name="j_password"></td>
                    </tr>
                    <tr>
                        <td align="center" colspan="2">
                            <br>
                            <input type="submit" value="LOGIN" style="width:100px;">
                            <input type="reset" value="RESET" style="width:100px;">
                        </td>
                    </tr>
                </table>
                <br>
                <h4>(Port padr�o do HTTPS:     443)</h4>
                <h4>(Port do HTTPS do Tomcat: 8443)</h4>
            </form>
        </div>
    </body>
</html>
