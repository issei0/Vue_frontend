export default {
    methods: {
        readCookie() {
            var name = "jwt" + "=";
            var decoded_cookie = decodeURIComponent(document.cookie);
            var carr = decoded_cookie.split(';');
            for(var i=0; i<carr.length;i++){
                var c = carr[i];
            while(c.charAt(0)==' '){
                c=c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
            }
            return "";
        },
        eraseCookie() {   
            document.cookie = 'jwt'+'=; Max-Age=-99999999;';  
        },        
    },
  };