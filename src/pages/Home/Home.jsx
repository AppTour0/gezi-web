import React, { useContext } from "react";
import StoreContext from "../../components/Store/Context";
import UserContext from "../../components/Store/Data/UserContext";
import { useHistory } from "react-router-dom";
import "./Home.css";
import { PASS_CRYPT } from "../../.key";
import { pbkdf2 }  from 'pbkdf2';

const PagesHome = () => {
  const { setToken } = useContext(StoreContext);
  const { setIdUser } = useContext(UserContext);
  const history = useHistory();

  function Logout() {
    setToken(null);
    setIdUser(null);
    return history.push("/");
  }

  function Services() {
    return history.push("/services");
  }

  async function getDerivation(hash, salt, password, iterations, keyLength) {
    /* const textEncoder = new TextEncoder("utf-8");
    const passwordBuffer = textEncoder.encode(password+PASS_CRYPT);
    const importedKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, ["deriveBits"]);
    
    const saltBuffer = textEncoder.encode(salt);
    //const params = {name: "PBKDF2", hash: hash, salt: saltBuffer, iterations: };
    const params = {name: "PBKDF2",  hash: hash, salt: saltBuffer, iterations: iterations};
    const derivation = await crypto.subtle.deriveBits(params, importedKey, keyLength);

    const keyArray = Array.from(new Uint8Array(derivation));                                      // key as byte array
      const keyStrNew = keyArray.map((byte) =>{ 
    console.log(byte);
    });   */ 
    /* const callback = {};
  var key2 = pbkdf2(password+PASS_CRYPT, '', 100, 0, callback); */

    let id = 'pcks';
    //let rnd = new FortunaRandom().seed(new KeyParameter(new Uint8List(32)));
    //console.log(rnd);
    /* let _salt = salt == null ? rnd.nextBytes(32) : createUint8ListFromHexString(salt);
    let _derivator =
        new PBKDF2KeyDerivator(new HMac(new SHA512Digest(), blockLength))
          ..init(new Pbkdf2Parameters(_salt, iterationCount, desiredKeyLength));
    var encode(id, List params, String salt, String hash) {
      return ['', id, params.join(','), salt, hash].join('\$');
    };
    var processo = (password) => {      
      let bytes =
          _derivator.process(new Uint8List.fromList(password.codeUnits));  
      return encode(
        id,
        [blockLength, iterationCount, desiredKeyLength],
        formatBytesAsHexString(_salt),
        formatBytesAsHexString(bytes),
      );
    } */
  }

  return (
    <div className="container">
      Parabéns, você conseguiu
      <br />
      <button type="button" onClick={() => Services()}>
        Passeios
      </button>
      <button type="button" onClick={() => Logout()}>
        Sair
      </button>
      <a name="" id="" class="btn btn-primary" href="#" onClick={ async () => {
        getDerivation("SHA-512", "", "12345678", 100, 512)
      }} role="button">gerar</a>
    </div>
  );
};

export default PagesHome;
