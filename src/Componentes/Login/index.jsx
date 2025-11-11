import './style.css';

function LoginButton() {
  const handleLogin = () => {
    keycloak.login();
    console.log("Login realizado com sucesso!");
  };

  return (
    <>
      <div className="containerLogin">
        <div className="formLogin">
          <h2 className='titulo' >Entrar no sistema de Recepção</h2>
          <div className="login">
            <button className='btnVisitantes' onClick={handleLogin}>
              Usar Credenciais
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginButton;
