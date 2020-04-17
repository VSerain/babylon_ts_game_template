import mixins from "../gameEngine/mixins/index";

export default function applyMixins<T>(defaultClass: T, mixinNames: Array<string>): T {
    mixinNames.forEach(mixinName => {
        if (mixins.hasOwnProperty(mixinName)) {
            defaultClass = mixins[mixinName](defaultClass)
        }
        else {
            throw new Error (`The mixin ${mixinName} is not found`);
        }
    })
    return defaultClass;
}
