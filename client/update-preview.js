"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapped_dom_tree_1 = require("./wrapped-dom-tree");
const MathJaxHelper = require("./mathjax-helper");
const renderer = require("./renderer");
const util_1 = require("./util");
class UpdatePreview {
    constructor(dom) {
        this.tree = new wrapped_dom_tree_1.WrappedDomTree(dom, true);
    }
    update(document, domFragment, renderLaTeX, highlightCodeBlocks, mjrenderer) {
        prepareCodeBlocksForAtomEditors(document, domFragment);
        if (this.domFragment && domFragment.isEqualNode(this.domFragment)) {
            return undefined;
        }
        const firstTime = this.domFragment === undefined;
        this.domFragment = domFragment.cloneNode(true);
        const newDom = document.createElement('div');
        newDom.className = 'update-preview';
        newDom.appendChild(domFragment);
        const newTree = new wrapped_dom_tree_1.WrappedDomTree(newDom, false);
        const r = this.tree.diffTo(newTree);
        newTree.removeSelf();
        if (firstTime) {
            r.possibleReplace = undefined;
            r.last = undefined;
        }
        r.inserted = r.inserted.filter((elm) => elm.nodeType === Node.ELEMENT_NODE);
        if (renderLaTeX) {
            if (firstTime) {
                util_1.handlePromise(MathJaxHelper.mathProcessor([document.body], mjrenderer));
            }
            else {
                util_1.handlePromise(MathJaxHelper.mathProcessor(r.inserted, mjrenderer));
            }
        }
        if (highlightCodeBlocks) {
            for (const elm of r.inserted) {
                renderer.highlightCodeBlocks(elm);
            }
        }
        this.updateOrderedListsStart(this.domFragment);
        return r;
    }
    updateOrderedListsStart(fragment) {
        if (this.tree.shownTree === undefined) {
            throw new Error('shownTree undefined in updateOrderedListsStart');
        }
        if (!util_1.isElement(this.tree.shownTree.dom)) {
            throw new Error('this.tree.shownTree.dom is not an Element in updateOrderedListsStart');
        }
        const previewOLs = this.tree.shownTree.dom.querySelectorAll('ol');
        const parsedOLs = fragment.querySelectorAll('ol');
        const end = parsedOLs.length - 1;
        for (let i = 0; i <= end; i++) {
            const previewStart = previewOLs[i].getAttribute('start');
            const parsedStart = parsedOLs[i].getAttribute('start');
            if (previewStart === parsedStart) {
                continue;
            }
            else if (parsedStart !== null) {
                previewOLs[i].setAttribute('start', parsedStart);
            }
            else {
                previewOLs[i].removeAttribute('start');
            }
        }
    }
}
exports.UpdatePreview = UpdatePreview;
function prepareCodeBlocksForAtomEditors(document, domFragment) {
    for (const preElement of Array.from(domFragment.querySelectorAll('pre'))) {
        const preWrapper = document.createElement('span');
        preWrapper.className = 'atom-text-editor';
        preElement.parentNode.insertBefore(preWrapper, preElement);
        preWrapper.appendChild(preElement);
    }
    return domFragment;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByZXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMtY2xpZW50L3VwZGF0ZS1wcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBc0JBLHlEQUFtRDtBQUNuRCxrREFBa0Q7QUFDbEQsdUNBQXVDO0FBQ3ZDLGlDQUFpRDtBQUVqRDtJQUtFLFlBQVksR0FBWTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVNLE1BQU0sQ0FDWCxRQUFzQixFQUN0QixXQUE2QixFQUM3QixXQUFvQixFQUNwQixtQkFBNEIsRUFDNUIsVUFBMkI7UUFFM0IsK0JBQStCLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBRXRELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sQ0FBQyxTQUFTLENBQUE7UUFDbEIsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFBO1FBQ2hELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQXFCLENBQUE7UUFFbEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM1QyxNQUFNLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFBO1FBQ25DLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQ0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUVqRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUE7UUFFcEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFBO1lBQzdCLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFBO1FBQ3BCLENBQUM7UUFFRCxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUUzRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2Qsb0JBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7WUFDekUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLG9CQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7WUFDcEUsQ0FBQztRQUNILENBQUM7UUFHRCxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDeEIsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFjLENBQUMsQ0FBQTtZQUM5QyxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFOUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUNWLENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxRQUEwQjtRQUN4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtRQUNuRSxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLElBQUksS0FBSyxDQUNiLHNFQUFzRSxDQUN2RSxDQUFBO1FBQ0gsQ0FBQztRQUNELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqRSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFakQsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7UUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFdEQsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLFFBQVEsQ0FBQTtZQUNWLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBQ2xELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBdkZELHNDQXVGQztBQUVELHlDQUNFLFFBQXNCLEVBQ3RCLFdBQTZCO0lBRTdCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sVUFBVSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDakQsVUFBVSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtRQUN6QyxVQUFVLENBQUMsVUFBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFDM0QsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQTtBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGluY29ycG9yYXRlcyBjb2RlIGZyb20gW21hcmttb25dKGh0dHBzOi8vZ2l0aHViLmNvbS95eWpoYW8vbWFya21vbilcbi8vIGNvdmVyZWQgYnkgdGhlIGZvbGxvd2luZyB0ZXJtczpcbi8vXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTQsIFlhbyBZdWppYW4sIGh0dHA6Ly95anlhby5jb21cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuaW1wb3J0IHsgV3JhcHBlZERvbVRyZWUgfSBmcm9tICcuL3dyYXBwZWQtZG9tLXRyZWUnXG5pbXBvcnQgTWF0aEpheEhlbHBlciA9IHJlcXVpcmUoJy4vbWF0aGpheC1oZWxwZXInKVxuaW1wb3J0IHJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpXG5pbXBvcnQgeyBoYW5kbGVQcm9taXNlLCBpc0VsZW1lbnQgfSBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVQcmV2aWV3IHtcbiAgcHJpdmF0ZSBkb21GcmFnbWVudD86IERvY3VtZW50RnJhZ21lbnRcbiAgcHJpdmF0ZSB0cmVlOiBXcmFwcGVkRG9tVHJlZVxuICAvLyBAcGFyYW0gZG9tIEEgRE9NIGVsZW1lbnQgb2JqZWN0XG4gIC8vICAgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9lbGVtZW50XG4gIGNvbnN0cnVjdG9yKGRvbTogRWxlbWVudCkge1xuICAgIHRoaXMudHJlZSA9IG5ldyBXcmFwcGVkRG9tVHJlZShkb20sIHRydWUpXG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKFxuICAgIGRvY3VtZW50OiBIVE1MRG9jdW1lbnQsXG4gICAgZG9tRnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQsXG4gICAgcmVuZGVyTGFUZVg6IGJvb2xlYW4sXG4gICAgaGlnaGxpZ2h0Q29kZUJsb2NrczogYm9vbGVhbixcbiAgICBtanJlbmRlcmVyOiBNYXRoSmF4UmVuZGVyZXIsXG4gICkge1xuICAgIHByZXBhcmVDb2RlQmxvY2tzRm9yQXRvbUVkaXRvcnMoZG9jdW1lbnQsIGRvbUZyYWdtZW50KVxuXG4gICAgaWYgKHRoaXMuZG9tRnJhZ21lbnQgJiYgZG9tRnJhZ21lbnQuaXNFcXVhbE5vZGUodGhpcy5kb21GcmFnbWVudCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdFRpbWUgPSB0aGlzLmRvbUZyYWdtZW50ID09PSB1bmRlZmluZWRcbiAgICB0aGlzLmRvbUZyYWdtZW50ID0gZG9tRnJhZ21lbnQuY2xvbmVOb2RlKHRydWUpIGFzIERvY3VtZW50RnJhZ21lbnRcblxuICAgIGNvbnN0IG5ld0RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgbmV3RG9tLmNsYXNzTmFtZSA9ICd1cGRhdGUtcHJldmlldydcbiAgICBuZXdEb20uYXBwZW5kQ2hpbGQoZG9tRnJhZ21lbnQpXG4gICAgY29uc3QgbmV3VHJlZSA9IG5ldyBXcmFwcGVkRG9tVHJlZShuZXdEb20sIGZhbHNlKVxuXG4gICAgY29uc3QgciA9IHRoaXMudHJlZS5kaWZmVG8obmV3VHJlZSlcbiAgICBuZXdUcmVlLnJlbW92ZVNlbGYoKVxuXG4gICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgci5wb3NzaWJsZVJlcGxhY2UgPSB1bmRlZmluZWRcbiAgICAgIHIubGFzdCA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHIuaW5zZXJ0ZWQgPSByLmluc2VydGVkLmZpbHRlcigoZWxtKSA9PiBlbG0ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuXG4gICAgaWYgKHJlbmRlckxhVGVYKSB7XG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGhhbmRsZVByb21pc2UoTWF0aEpheEhlbHBlci5tYXRoUHJvY2Vzc29yKFtkb2N1bWVudC5ib2R5XSwgbWpyZW5kZXJlcikpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYW5kbGVQcm9taXNlKE1hdGhKYXhIZWxwZXIubWF0aFByb2Nlc3NvcihyLmluc2VydGVkLCBtanJlbmRlcmVyKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiB3aHkgaXMgdGhpcyBoYXBwZW5pbmcgaGVyZT9cbiAgICBpZiAoaGlnaGxpZ2h0Q29kZUJsb2Nrcykge1xuICAgICAgZm9yIChjb25zdCBlbG0gb2Ygci5pbnNlcnRlZCkge1xuICAgICAgICAvLyBOT1RFOiBmaWx0ZXJlZCBhYm92ZVxuICAgICAgICByZW5kZXJlci5oaWdobGlnaHRDb2RlQmxvY2tzKGVsbSBhcyBFbGVtZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlT3JkZXJlZExpc3RzU3RhcnQodGhpcy5kb21GcmFnbWVudClcblxuICAgIHJldHVybiByXG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU9yZGVyZWRMaXN0c1N0YXJ0KGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgaWYgKHRoaXMudHJlZS5zaG93blRyZWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaG93blRyZWUgdW5kZWZpbmVkIGluIHVwZGF0ZU9yZGVyZWRMaXN0c1N0YXJ0JylcbiAgICB9XG4gICAgaWYgKCFpc0VsZW1lbnQodGhpcy50cmVlLnNob3duVHJlZS5kb20pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICd0aGlzLnRyZWUuc2hvd25UcmVlLmRvbSBpcyBub3QgYW4gRWxlbWVudCBpbiB1cGRhdGVPcmRlcmVkTGlzdHNTdGFydCcsXG4gICAgICApXG4gICAgfVxuICAgIGNvbnN0IHByZXZpZXdPTHMgPSB0aGlzLnRyZWUuc2hvd25UcmVlLmRvbS5xdWVyeVNlbGVjdG9yQWxsKCdvbCcpXG4gICAgY29uc3QgcGFyc2VkT0xzID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvckFsbCgnb2wnKVxuXG4gICAgY29uc3QgZW5kID0gcGFyc2VkT0xzLmxlbmd0aCAtIDFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgY29uc3QgcHJldmlld1N0YXJ0ID0gcHJldmlld09Mc1tpXS5nZXRBdHRyaWJ1dGUoJ3N0YXJ0JylcbiAgICAgIGNvbnN0IHBhcnNlZFN0YXJ0ID0gcGFyc2VkT0xzW2ldLmdldEF0dHJpYnV0ZSgnc3RhcnQnKVxuXG4gICAgICBpZiAocHJldmlld1N0YXJ0ID09PSBwYXJzZWRTdGFydCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfSBlbHNlIGlmIChwYXJzZWRTdGFydCAhPT0gbnVsbCkge1xuICAgICAgICBwcmV2aWV3T0xzW2ldLnNldEF0dHJpYnV0ZSgnc3RhcnQnLCBwYXJzZWRTdGFydClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpZXdPTHNbaV0ucmVtb3ZlQXR0cmlidXRlKCdzdGFydCcpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDb2RlQmxvY2tzRm9yQXRvbUVkaXRvcnMoXG4gIGRvY3VtZW50OiBIVE1MRG9jdW1lbnQsXG4gIGRvbUZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50LFxuKSB7XG4gIGZvciAoY29uc3QgcHJlRWxlbWVudCBvZiBBcnJheS5mcm9tKGRvbUZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZScpKSkge1xuICAgIGNvbnN0IHByZVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBwcmVXcmFwcGVyLmNsYXNzTmFtZSA9ICdhdG9tLXRleHQtZWRpdG9yJ1xuICAgIHByZUVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKHByZVdyYXBwZXIsIHByZUVsZW1lbnQpXG4gICAgcHJlV3JhcHBlci5hcHBlbmRDaGlsZChwcmVFbGVtZW50KVxuICB9XG4gIHJldHVybiBkb21GcmFnbWVudFxufVxuIl19