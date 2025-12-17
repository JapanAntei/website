<script setup lang="ts">
import { ref, watch, onMounted, type ModelRef } from 'vue';
import { holdNum, keyCode, type KeyBinds, type keyboardAlias as keyboardAliasType, type keys } from '../scripts/globalData';
const keyName: {id: keyof KeyBinds, name: string}[] = [
    {id: "down",name: "ソフトドロップ"},
    {id: "drop",name: "ハードドロップ"},
    {id: "left",name: "左移動"},
    {id: "right",name: "右移動"},
    {id: "rotateR",name: "回転 (時計回り)"},
    {id: "rotateL",name: "回転 (反時計回り)"},
    {id: "pause",name: "ポーズ"},
]
const keybindFirst = defineModel<KeyBinds>("keybindFirst")
const keybindSecond = defineModel<KeyBinds>("keybindSecond")
const keyboardAlias = defineModel<keyboardAliasType>("keyboardAlias")

const props = defineProps<
{
    secondPlayer: boolean,
    reset: number,
    settingId: string,
    defaultKeybindFirst: KeyBinds,
    defaultKeybindSecond: KeyBinds,
    defaultKeyboardAlias: keyboardAliasType,
}>()

const holdRef = ref<number>(holdNum)

const addKeyAliasKey = ref<keys>()
const addKeyAliasItem = ref<keys>()

watch(() => props.reset, () =>{
    holdRef.value = holdNum
})

function getStorageKeybinds(binds: ModelRef<KeyBinds | undefined, string>, defaultBinds: KeyBinds, bindsName: string){
    let keyBindStorage: KeyBinds = defaultBinds;
    const storageStr = localStorage.getItem(props.settingId +bindsName)
    if(storageStr){
        try{
            keyBindStorage = JSON.parse(storageStr)
        } catch(e){}
    }
    if(binds.value){
        for(const index in keyBindStorage){
            if(Array.isArray(keyBindStorage[index as keyof KeyBinds])){
                binds.value[index as "hold"] = []
                for(const keys of keyBindStorage[index as "hold"]){
                binds.value[index as "hold"].push(keys)
                }
            }else {
                binds.value[index as "down"] = keyBindStorage[index as "down"]
            }
        }
    }
}

onMounted(() =>{
    getStorageKeybinds(
        keybindFirst,
        props.defaultKeybindFirst,
        "FirstKeyBind"
    )
    getStorageKeybinds(
        keybindSecond,
        props.defaultKeybindSecond,
        "SecondKeyBind"
    )
    if(keyboardAlias.value){
    console.log(props.defaultKeybindFirst)
    console.log(props.defaultKeyboardAlias)
        for(const key in keyboardAlias.value){
            delete keyboardAlias.value[key as keys]
        }
        try{
            const keyAliasStorage = JSON.parse(localStorage.getItem(props.settingId + "KeyAlias") ?? "")
            for(const index in keyAliasStorage){
                keyboardAlias.value[index as keys] = keyAliasStorage[index]
            }
        } catch(e){
            for(const index in props.defaultKeyboardAlias){
                keyboardAlias.value[index as keys] = props.defaultKeyboardAlias[index as keys]
            }
        }
    }
})

function settingKeyboard(isFirst = true, keyType: keyof KeyBinds = "down",  e: KeyboardEvent){
    e.preventDefault()
    e.stopPropagation()
    if(e.code in keyCode){
        if(isFirst && keybindFirst.value) (keybindFirst.value[keyType] as keys) = keyCode[e.code as "Space"]
        if(!isFirst && keybindSecond.value) (keybindSecond.value[keyType] as keys) = keyCode[e.code as "Space"]
    }
}
function settingKeyboardHold(isFirst = true, index: number,  e: KeyboardEvent){
    e.preventDefault()
    e.stopPropagation()
    if(e.code in keyCode){
        if(isFirst && keybindFirst.value){
            if(!keybindFirst.value.hold) keybindFirst.value.hold = []
            keybindFirst.value.hold[index] = keyCode[e.code as "Space"]
        }
        if(!isFirst && keybindSecond.value){
            if(!keybindSecond.value.hold) keybindSecond.value.hold = []
            keybindSecond.value.hold[index] = keyCode[e.code as "Space"]
        }
    }
}

function settingKeyaliasFromKey(key: keys = "_", e: KeyboardEvent){
    e.preventDefault()
    e.stopPropagation()
    if(e.code in keyCode){
        if(keyboardAlias.value){
            keyboardAlias.value[keyCode[e.code as "Space"]] = keyboardAlias.value[key]
            delete keyboardAlias.value[key]
        }
    }
}

function settingKeyaliasFromItem(key: keys = "_", e: KeyboardEvent){
    e.preventDefault()
    e.stopPropagation()
    if(e.code in keyCode){
        if(keyboardAlias.value){
            keyboardAlias.value[key] = keyCode[e.code as "Space"]
        }
    }

}

function removeKeyalias(key: keys = "_"){
    if(keyboardAlias.value){
        delete keyboardAlias.value[key]
    }
}

function addKeyalias(){
    if(keyboardAlias.value && addKeyAliasKey.value && addKeyAliasItem.value){
        keyboardAlias.value[addKeyAliasKey.value] = addKeyAliasItem.value;
        addKeyAliasKey.value = undefined;
        addKeyAliasItem.value = undefined;
    }
}

function addingKeyAliasKey(e: KeyboardEvent){
    if(e.code in keyCode){
        addKeyAliasKey.value = keyCode[e.code as "Space"]
    }
}
function addingKeyAliasItem(e: KeyboardEvent){
    if(e.code in keyCode){
        addKeyAliasItem.value = keyCode[e.code as "Space"]
    }
}

</script>

<template>
    <details>
        <summary>キーボードの設定</summary>
        <h3>キーバインド</h3>
        <div id="keyBinds">
            <div v-for="(item) in keyName" :key="`keybind-${item.id}`" class="keybindBox">
                <span>{{ item.name }}</span>
                <div style="text-align: left; margin-left: 10px;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="keybindFirst?.[item.id] as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyboard(true, item.id, e)">
                    </div>
                    <div style="vertical-align: top" v-if="secondPlayer" :key="`keybind-second-${item.id}`">
                        <input type="text" :placeholder="keybindSecond?.[item.id] as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyboard(false, item.id, e)">
                    </div>
                </div>
            </div>
            <div v-for="index in holdRef" :key="`keybind-hold-${index}`" class="keybindBox">
                <span>{{ `ホールド ${index}` }}</span>
                <div style="text-align: left; margin-left: 10px;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="keybindFirst?.hold[index-1] as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyboardHold(true, index-1, e)">
                    </div>
                    <div style="vertical-align: top" v-if="secondPlayer" :key="`keybind-second-${index}`">
                        <input type="text" :placeholder="keybindSecond?.hold[index-1] as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyboardHold(false, index-1, e)">
                    </div>
                </div>
            </div>
        </div>
        <h3>キーの割り当て変更</h3>
        <div id="keyAlias">
            <div v-for="(item, key) in keyboardAlias" :key="`keyalias-${key}`" class="keyaliasBox">
                <div style="text-align: left;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="key as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyaliasFromKey(key, e)">
                    </div>
                </div>
                <div style="text-align: left; margin-left: 10px;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="item as keys ?? 'なし'" @keydown="(e: KeyboardEvent) => settingKeyaliasFromItem(key, e)">
                    </div>
                </div>
                <div style="text-align: left; margin-left: 10px; height: 1lh;">
                    <button @click="() => removeKeyalias(key)" class="controlButton">×</button>
                </div>
            </div>
            <div class="keyaliasBox">
                <div style="text-align: left;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="addKeyAliasKey as keys ?? 'キーを入力してください'" @keydown="(e: KeyboardEvent) => addingKeyAliasKey(e)">
                    </div>
                </div>
                <div style="text-align: left; margin-left: 10px;">
                    <div style="vertical-align: top">
                        <input type="text" :placeholder="addKeyAliasItem as keys ?? 'キーを入力してください'" @keydown="(e: KeyboardEvent) => addingKeyAliasItem(e)">
                    </div>
                </div>
                <div style="text-align: left; margin-left: 10px; height: 1lh;">
                    <button @click="addKeyalias" class="controlButton">+</button>
                </div>
            </div>
        </div>
    </details>
</template>

<style scoped>
details{
    border: green solid 2px;
    border-radius: 5px;
    width: 80vw;
}

/*#keyBinds{
    display: grid;
    grid-template-columns: 0.5fr 10em 10em;
}*/

.keybindBox{
    display: grid;
    grid-template-columns: 10em 15em;
    place-items: center;
    justify-content: center;
    margin-bottom: 10px;
}
.keyaliasBox{
    display: grid;
    grid-template-columns: 12em 12em 2rlh;
    place-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

input::placeholder {
	text-align: center;
    color:inherit;
}

input{
    height:1rlh;
    box-sizing: border-box;
}

.controlButton{
  padding : 0px;
  border-radius: 5px;
  height: 1rlh;
  width: 1rlh;
  border-color: transparent;
  box-shadow: 1px, 2px rgba(0,0,0,0.2);
  outline: none;
  font-size: 0.8rlh;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
  transition-property: opacity;
  transition-duration: 0.25s;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>