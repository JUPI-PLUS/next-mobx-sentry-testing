import { observer } from "mobx-react";
import Breadcrumbs from "../../../../components/uiKit/Breadcrumbs/Breadcrumbs";
import { useKitTemplateStore } from "../../store";

const Header = () => {
    const {
        kitTemplateStore: { isEditPage },
    } = useKitTemplateStore();

    return <Breadcrumbs label={isEditPage ? "Edit kit template" : "Create kit template"} />;
};

export default observer(Header);
