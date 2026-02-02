import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/hr_admin_component/navbar/Navbar";
import AppTemplateRouter from "../../router/AppTemplateRouter";

const AppTemplatePage = () => {
  return (<>
    <div className="relative h-full min-h-screen font-[sans-serif]">
        <section className="main-content w-full">
          <AppTemplateRouter/>
        </section>
    </div>
    </>
  )

}

export default AppTemplatePage;