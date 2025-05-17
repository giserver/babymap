import { readFileSync, writeFileSync } from 'fs';
import { text } from 'stream/consumers';
import { UserConfig, DefaultTheme, Plugin } from 'vitepress';

function serialize(obj, name) {
    var result = "";
    function serializeInternal(o, path) {
        for (const p in o) {
            var value = o[p];
            if (typeof value != "object") {
                if (typeof value == "string") {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "] = " + "\"" + value.replace(/\"/g, "\\\"") + "\"" + ";";
                } else {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "] = " + value + ";";
                }
            }
            else {
                if (Array.isArray(value)) {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]" + "=" + "new Array();";
                    serializeInternal(value, path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]");
                } else {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]" + "=" + "new Object();";
                    serializeInternal(value, path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]");
                }
            }
        }
    }
    serializeInternal(obj, name);
    return result;
}

const FilterDataJSPlugin = {
    apply: (c, e) => {
        c.plugins?.forEach((p: any) => {
            if (p["name"] === "vitepress:data") {
                const orgLoad = p.load;
                p.load = async (id: string) => {
                    if (id.endsWith("KHR_animation_pointer.data.js"))
                        return;

                    await orgLoad(id);
                }
            }
        });
    }
} as Plugin;

export default {
    title: 'babymap',
    description: 'babylonjs 与 mapbox maplibre 融合',
    appearance: 'dark',
    base: '/babymap/',
    head: [
        [
            'link', { rel: 'icon', href: '/logo.svg' }
        ]
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        logo: '/logo.svg',
        sidebar: [
            {
                text: '介绍',
                collapsed: false,
                items: [
                    { text: 'babymap', link: '/pages/' },
                    { text: '安装', link: '/pages/install' },
                    { text: '反馈', link: '/pages/feedback' }
                ]
            },
            {
                text: '功能',
                collapsed: true,
                base: "/pages/features/",
                items: [
                    {
                        text: "线",
                        items: [
                            { text: "基本", link: "line"},
                            { text: "流光", link: "line/flow"}
                        ]
                    }
                ]
            }
        ],
        socialLinks: [{ icon: 'github', link: "https://github.com/giserver/babymap" }],
    },
    vite: {
        'plugins': [FilterDataJSPlugin],
    }
} as UserConfig<DefaultTheme.Config>