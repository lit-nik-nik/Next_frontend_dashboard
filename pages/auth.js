import {MainLyout} from "../components/layout/main"
import style from '../styles/auth.module.css'

export default function Home() {
    return (
        <MainLyout>
            <div className={style.authBody}>
                <main className={`form-signin ${style.formSign}`}>
                    <form>
                        <h1 className="h3 mb-3 fw-normal text-center">Авторизация</h1>

                        <div className={`form-floating ${style.formFloating}`}>
                            <input type="text" className="form-control" id="floatingInput" placeholder="Логин" />
                            <label htmlFor="floatingInput">Логин</label>
                        </div>
                        <div className={`form-floating ${style.formFloating}`}>
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Пароль" />
                            <label htmlFor="floatingPassword">Пароль</label>
                        </div>

                        <div className={`${style.checkbox} checkbox mb-3 text-center`}>
                            <label>
                                <input type="checkbox" value="remember-me"/> Запомнить меня
                            </label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Войти</button>
                    </form>
                </main>
            </div>
        </MainLyout>
    )
}


