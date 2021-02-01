const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const { SETTINGS_ID } = Me.imports.constants;

const INTERVAL_KEY = 'interval';
const DEVICES_KEY = 'devices';
const SETTINGS_TS_KEY = 'settings-ts';

var SettingsController = class SettingsController {
    constructor() {
        this._settings = ExtensionUtils.getSettings(SETTINGS_ID);
    }

    getInterval() {
        return this._settings.get_int(INTERVAL_KEY);
    }

    setInterval(interval) {
        this._settings.set_int(INTERVAL_KEY, interval);
        this._updateSettingsTS();
    }

    getDevices() {
        return this._settings.get_strv(DEVICES_KEY).map(JSON.parse);
    }

    getActiveDevices() {
        return this.getDevices().filter(({ active }) => active);
    }

    setDevices(devices) {
        this._settings.set_strv(DEVICES_KEY, devices.map(JSON.stringify));
        this._updateSettingsTS();
    }

    setDevice(device) {
        const devices = this.getDevices();
        const indexOf = devices.findIndex(({ mac }) => device.mac === mac);

        if (indexOf !== -1) {
            devices[indexOf] = {
                ...devices[indexOf],
                ...device,
            };
            this.setDevices(devices);
        }
    }

    getSettingsTS() {
        return this._settings.get_int(SETTINGS_TS_KEY);
    }

    _updateSettingsTS() {
        this._settings.set_int(SETTINGS_TS_KEY, new Date().valueOf());
    }
}