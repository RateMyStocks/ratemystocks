import { Component } from "@angular/core";
import { AppBreadcrumbService } from "../../../../app.breadcrumb.service";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
    selectedState: any = null;

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: "Profile" },
            { label: "Settings", routerLink: ["/uikit/formlayout"] },
        ]);
    }

    states: any[] = [
        { name: "Arizona", code: "Arizona" },
        { name: "California", value: "California" },
        { name: "Florida", code: "Florida" },
        { name: "Ohio", code: "Ohio" },
        { name: "Washington", code: "Washington" },
    ];
}
