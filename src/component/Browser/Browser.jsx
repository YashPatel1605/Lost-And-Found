import LostFoundList from "../BrowserAllItem/BrowserAllItem";
import BrowserLostFound from "../BrowserLostFound/BrowserLostFound";
import Footer from "../Footer/Footer";

export default function Browse(){
    return(
        <>
        {/* <h2>Browse</h2> */}
        <BrowserLostFound/>
        <LostFoundList/>
        <Footer/>
        </>
    )
}