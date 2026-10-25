// Dijalankan setelah "npx cap add android": izin kamera, plugin cetak native, ikon
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));
const pkg = cfg.appId;
const javaDir = `android/app/src/main/java/${pkg.replace(/\./g, '/')}`;
mkdirSync(javaDir, { recursive: true });

writeFileSync(`${javaDir}/NativePrintPlugin.java`, `package ${pkg};

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativePrint")
public class NativePrintPlugin extends Plugin {
    @PluginMethod
    public void print(final PluginCall call) {
        final String name = call.getString("name", "Dokumen");
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    WebView wv = getBridge().getWebView();
                    PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                    PrintDocumentAdapter adapter = wv.createPrintDocumentAdapter(name);
                    pm.print(name, adapter, new PrintAttributes.Builder().build());
                    call.resolve();
                } catch (Exception e) {
                    call.reject(String.valueOf(e.getMessage()));
                }
            }
        });
    }
}
`);

writeFileSync(`${javaDir}/MainActivity.java`, `package ${pkg};

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativePrintPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
`);

// AndroidManifest: izin kamera
const mf = 'android/app/src/main/AndroidManifest.xml';
let x = readFileSync(mf, 'utf8');
if (!x.includes('android.permission.CAMERA')) {
  x = x.replace('<application',
    '<uses-permission android:name="android.permission.CAMERA" />\n' +
    '    <uses-feature android:name="android.hardware.camera" android:required="false" />\n' +
    '    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />\n\n    <application');
  writeFileSync(mf, x);
}

// Ikon
const res = 'android/app/src/main/res';
if (existsSync('resources/android')) cpSync('resources/android', res, { recursive: true });
writeFileSync(`${res}/values/ic_launcher_background.xml`,
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#2563EB</color>
</resources>
`);
console.log('Patch Android selesai');
