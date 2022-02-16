// Taken from https://holonext.azurewebsites.net/public/js/hn-sdk-embed-v4.js

(function holonextEmbedModelViewerIIFE() {
    console.log("asdfasdf")
    if (!window.holonextDependenciesLoaded) {
        loadDependencies();
    }

    function clickIosLink() {
        this.parentNode.getElementById("quicklookTrigger").click();
    }


    function loadDependencies() {
        try {
            window.holonextDependenciesLoaded = true;
            window.labelList = [];
            window.lastLabelIndex = -1;

            const babylonScript = document.createElement("script");
            babylonScript.src = "https://cdn.babylonjs.com/babylon.js";
            const babylonScriptLoadEvent = new Event("babylonScriptLoaded");
            babylonScript.onload = (event) => {
                const babylonLoaderScript = document.createElement("script");
                babylonLoaderScript.src =
                    "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js";
                const babylonLoaderScriptLoadEvent = new Event(
                    "babylonLoaderScriptLoaded"
                );
                babylonLoaderScript.onload = (event) => {
                    document.dispatchEvent(babylonLoaderScriptLoadEvent);
                    const qrCodeScript = document.createElement("script");
                    qrCodeScript.src =
                        "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
                    const qrCodeScriptLoadEvent = new Event("qrCodeScriptLoaded");
                    qrCodeScript.onload = (event) => {
                        document.dispatchEvent(qrCodeScriptLoadEvent);
                        const babylonGuiScript = document.createElement("script");
                        babylonGuiScript.src =
                            "https://cdn.babylonjs.com/gui/babylon.gui.min.js";
                        const babylonGuiScriptLoadEvent = new Event(
                            "babylonGuiScriptLoaded"
                        );
                        babylonGuiScript.onload = (event) => {
                            document.dispatchEvent(babylonGuiScriptLoadEvent);
                            defineHolonextViewerComponent();
                        };
                        document.head.appendChild(babylonGuiScript);
                    };
                    document.head.appendChild(qrCodeScript);
                };
                document.head.appendChild(babylonLoaderScript);

                document.dispatchEvent(babylonScriptLoadEvent);
            };
            document.head.appendChild(babylonScript);

            const pepScript = document.createElement("script");
            pepScript.src = "https://code.jquery.com/pep/0.4.3/pep.js";
            const pepScriptLoadEvent = new Event("pepScriptLoaded");
            pepScript.onload = (event) => document.dispatchEvent(pepScriptLoadEvent);
            document.head.appendChild(pepScript);

            return true;
        } catch (error) {
            console.error("loadDependencies: ", error);
        }
    }

    var HOLONEXT_VARIANTS_CONTAINER_CLASS = "hn-variants-container";
    var HOLONEXT_VARIANT_CLASS = "hn-variant";
    var HOLONEXT_DROPDOWN_CONTAINER_CLASS = "hn-dropdown-container";
    var HOLONEXT_DROPDOWN_CONTENT_CLASS = "hn-dropdown-content";
    var HOLONEXT_DROPDOWN_OPENER_CLASS = "hn-dropdown-opener";
    var HOLONEXT_VARIANT_APPLIED_MESH_TITLE_CLASS = "hn-applied-mesh-title";
    var HOLONEXT_VARIANT_MESH_CONTAINER_CLASS = "hn-variant-mesh";
    var HOLONEXT_VARIANT_MESH_TITLE_CLASS = "hn-variant-mesh-title";
    var HOLONEXT_VARIANT_MESH_SELECT_BUTTON_CLASS =
        "hn-variant-mesh-select-button";
    var HOLONEXT_VARIANT_MESH_COLOR_PREVIEW_CLASS =
        "hn-variant-mesh-color-preview";

    const ELEMENT_DEFAULT_STYLES = `:host{ 
        display:inline-block; 
        width:var(--xModelWidth,100%); 
        height:var(--xModelHeight,100%); 
        transform-style:var(--xModelBoundingBoxTransformStyle, preserve-3d); 
        position: relative; 
    } 
    .arButton{ 
        position: absolute; 
        bottom: 0; 
        left: calc(50% - 95px);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-sizing: border-box; 
        cursor: pointer; 
        background-color: #fff; 
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15); 
        border-radius: 100px; 
        width: 188px; 
        height: 48px; 
        margin-bottom:10px;
    }

    .arButtonImageOnly{

      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: pointer;
      height: 48px;
      margin-bottom: 10px;
      padding: 15px;
      right: 0;

    }
    .arButtonImage{ 
        width: 36px; 
        height: 36px;
        padding-right:5px; 
     } 
     .btn {
      color:#ffffff;
      background-color:#46a9ea;
      z-index:10;
      border-radius:15px;
      font-size:16px;
      cursor:pointer;
      user-select:none;
      border:none;
      pointer-events:auto;
      padding:10px;
      position:relative;
      display:inline-block;
      margin:0 auto;
    
      }
    
    .modal-bg{
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background-color:rgba(0,0,0,0.5);
      display:flex;
      justify-content: center;
      align-items:center;
      visibility:hidden;
      opacity:0;
      transition: visibility 0s, opacity 0,5s;
    }

    .modal-close{
      position:absolute;
      top: 10px;
      right: 10px;
      font-weight:bold;
      cursor:pointer;
    }

    .bg-active{
      visibility: visible!important;
      opacity: 1;
    }

    .bg-deactive{
      visibility: hidden;
      opacity: 0;
      width:auto;
    } 

    .modal{
      position: relative;
      background-color:white;
      padding: 15px;
      display:flex;
      justify-content: space-around;
      align-items:center;
      flex-direction: column;

    }
    #holonextRenderTarget{
        width: 100%;
        height: 100%;
        position: absolute;
        outline:none;
    }
    #imgRender{
      width: 100%;
      position: absolute;
      visibility: hidden;
      outline:none;

  }
  #thumbnail-image{
    width:100%;
  }
    #progress-bar-wrapper {
      position:fixed;
      width: 320px;
      left: calc(50% - 160px);
      top: 40%;
      display: none;
    }
    
    .progress-bar {
      width: 100%;
      background-color: #e0e0e0;
      padding: 3px;
      border-radius: 3px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
    }
    
    #progress-bar-fill {
      display: block;
      height: 12px;
      background-color: #659cef;
      border-radius: 3px;
      transition: width 500ms ease-in-out;
    }

    .text-style{
      font-size: 20px;
      font-weight: 100;
    }
    .mb-10{
      margin-bottom:10px;
    }

  #variantsRelativeContainer {
    position: absolute; 
    bottom: 0; 
    left: calc(50% - 95px);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    box-sizing: border-box; 
    width: 188px; 
  }
  
  #openVariantsButton{ 
  
    cursor: pointer; 
    margin-bottom:10px;
    font-size: 14px;
  }
 
  #variantsMenu{
    display: none;
    position: absolute;
    top: 20px;
    width: 230px;
    height: auto;
    border-radius: 4px;
    border: 1px solid #3880ff;
    background: white;
  }
  #closeVariantsMenuButton{
    position: absolute;
    right: 10px;
    padding: 2px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  .${HOLONEXT_VARIANTS_CONTAINER_CLASS}{
    display: flex;
    flex-direction: column;
   right: 10px;
   bottom: 10px;
   margin-top: 30px;
  }
  .${HOLONEXT_VARIANT_CLASS}{
    width: 100%;
    height: auto;
    padding: 10px;
 }
 .${HOLONEXT_DROPDOWN_CONTAINER_CLASS}{
   position: relative;
   display: inline-block;
 }
 .${HOLONEXT_DROPDOWN_CONTENT_CLASS}{
   background-color: #f9f9f9;
   min-width: 160px;
   box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
   padding: 12px 16px;
   z-index: 1;
   flex-direction: column;
   font-size: 14px;
   border-radius: 5px;
 }
 .${HOLONEXT_DROPDOWN_CONTAINER_CLASS}:hover .${HOLONEXT_DROPDOWN_CONTENT_CLASS}{
   display: flex;
 }
 .${HOLONEXT_DROPDOWN_OPENER_CLASS}{
 }
 .${HOLONEXT_VARIANT_APPLIED_MESH_TITLE_CLASS}{
   font-weight: 500;
   margin: 0;
 }
 .${HOLONEXT_VARIANT_MESH_CONTAINER_CLASS}{
   display: flex;
   flex-direction: row;
   align-items: center;
 }
 .${HOLONEXT_VARIANT_MESH_TITLE_CLASS}{
   padding: 7px 0;
   width: 80%;
   display: flex;
   align-items: center;
 }
 .${HOLONEXT_VARIANT_MESH_SELECT_BUTTON_CLASS}{
   cursor: pointer;
   color: white;
   background: #3880ff;
   border-radius: 9px;
   padding: 5px;
   font-size: 12px;
   margin-left: 15px;
   margin-right: 15px;
 }
 .${HOLONEXT_VARIANT_MESH_COLOR_PREVIEW_CLASS}{
   width: 8px;
   height: 8px;
   border: 1px solid #222;
   border-radius: 2px;
   margin-right: 5px;
 }
 
 #holonextToggleAnnotations{
  position: absolute;
  width: 200px;
  left: 5%;
  bottom: 10px;
  height: 50px;
  display: flex;
  align-items: center;
}
#holonextToggleAnnotationsButton{
  margin-right: 10px;
  height: 30px;
  width: 40px;
  cursor:pointer;
}

#holonextTraverseAnnotations{
  display: flex;
  position: absolute;
  width: 200px;
  height: 30px;
  right: 5%;
  color: white;
  background: rgba(0,0,0,0.6);
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  bottom: 17px;
}
.holonextTraverseAnnotationsIcon{
  width: 25px;
  height: 25px;
  cursor: pointer;
}


    `;
    const ELEMENT_HTML =
        `<style>${ELEMENT_DEFAULT_STYLES}</style>` +
        '<canvas id="holonextRenderTarget" touch-action="none"></canvas>' +
        '<img id="imgRender"></img>' +
        "<a id=quicklookTrigger></a>" +
        `
      <div id="progress-bar-wrapper">
		 	  <div class="progress-bar">
		 		  <span id="progress-bar-fill" style="width: 10%;"></span>
		 	  </div>
		 </div>
    `;

    class HTMLModelElement extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.innerHTML = ELEMENT_HTML;
            this.currentAnnotationIndex = -1;
        }

        connectedCallback() {
            this.initiateArButton();
        }

        static get observedAttributes() {
            return ["src", "width", "height"];
        }

        createAnnotationTraverseUI({ annotations, scene }) {
            const index = annotations.map(e => e.camera);
            if (
                this.shadowRoot.getElementById("holonextRenderTarget").offsetWidth > 650
            ) {
                const annotationTraverseContainer = document.createElement("div");
                annotationTraverseContainer.setAttribute(
                    "id",
                    "holonextTraverseAnnotations"
                );

                const annotationTraverseIconLeft = document.createElement("img");
                // TODO UPDATE LINKS WITH HOLONEXT.AZUREWEBSITES
                annotationTraverseIconLeft.setAttribute(
                    "src",
                    "https://holonext.azurewebsites.net/public/images/left-arrow.svg"
                );
                annotationTraverseIconLeft.setAttribute(
                    "class",
                    "holonextTraverseAnnotationsIcon"
                );

                annotationTraverseContainer.appendChild(annotationTraverseIconLeft);

                const annotationTraverseText = document.createElement("div");
                annotationTraverseText.innerHTML = "Select an annotation";

                annotationTraverseContainer.appendChild(annotationTraverseText);

                const annotationTraverseIconRight = document.createElement("img");
                // TODO UPDATE LINKS WITH HOLONEXT.AZUREWEBSITES
                annotationTraverseIconRight.setAttribute(
                    "src",
                    "https://holonext.azurewebsites.net/public/images/right-arrow.svg"
                );
                annotationTraverseIconRight.setAttribute(
                    "class",
                    "holonextTraverseAnnotationsIcon"
                );
                annotationTraverseContainer.appendChild(annotationTraverseIconRight);

                annotationTraverseIconRight.addEventListener("click", (test) => {
                    this.currentAnnotationIndex =
                        (this.currentAnnotationIndex + 1) % annotations.length;
                    if (index[0] != undefined) {
                        this.moveCamera({
                            annotationCamera: annotations[this.currentAnnotationIndex].camera,
                            scene,
                        });
                    }
                    if (
                        window.labelList &&
                        window.labelList.length > 0
                    ) {
                        if (window.lastLabelIndex > -1) {
                            window.labelList[window.lastLabelIndex].isVisible = false;
                        }
                        window.labelList[this.currentAnnotationIndex].isVisible = true;
                        window.lastLabelIndex = this.currentAnnotationIndex;
                    }

                    annotationTraverseText.innerHTML =
                        annotations[this.currentAnnotationIndex].title.content;
                });

                annotationTraverseIconLeft.addEventListener("click", (test) => {
                    // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
                    function mod(n, m) {
                        return ((n % m) + m) % m;
                    }

                    this.currentAnnotationIndex = mod(
                        this.currentAnnotationIndex - 1,
                        annotations.length
                    );
                    if (index[0] != undefined) {
                        this.moveCamera({
                            annotationCamera: annotations[this.currentAnnotationIndex].camera,
                            scene,
                        });
                    }
                    if (
                        window.labelList &&
                        window.labelList.length > 0
                    ) {
                        if (window.lastLabelIndex > -1) {
                            window.labelList[window.lastLabelIndex].isVisible = false;
                        }
                        window.labelList[this.currentAnnotationIndex].isVisible = true;
                        window.lastLabelIndex = this.currentAnnotationIndex;
                    }

                    annotationTraverseText.innerHTML =
                        annotations[this.currentAnnotationIndex].title.content;
                });

                this.shadowRoot.append(annotationTraverseContainer);
            }
        }

        initiateVariants({
                             variants,
                             selectedVariants,
                             arButtonContainer,
                             variantIndexes,
                         }) {
            //console.log({ variants, selectedVariants, variantIndexes });
            if (variants && variants.length > 0) {
                // initiate variant variables
                if (!window.__holonext__selectedVariants) {
                    window.__holonext__selectedVariants = {};
                    window.__holonext__variantSelectors = {};
                }

                // variants relative container
                const variantsRelativeContainer = document.createElement("div");
                variantsRelativeContainer.setAttribute(
                    "id",
                    "variantsRelativeContainer"
                );
                this.shadowRoot.append(variantsRelativeContainer);

                // open variants button
                const variantsOpenButton = document.createElement("div");
                variantsOpenButton.setAttribute("id", "openVariantsButton");
                variantsOpenButton.innerHTML = "Variants";

                variantsRelativeContainer.append(variantsOpenButton);
                arButtonContainer.style.bottom = "20px";
                // variants menu
                const variantsMenu = document.createElement("div");
                variantsMenu.setAttribute("id", "variantsMenu");
                variantsRelativeContainer.append(variantsMenu);
                variantsOpenButton.onclick = () => {
                    variantsMenu.style.display = "block";
                };

                // close variants menu
                const closeVariantsMenu = document.createElement("img");
                closeVariantsMenu.src =
                    "https://holonext.azurewebsites.net/public/images/ios-close.91fc43e1.svg";
                closeVariantsMenu.id = "closeVariantsMenuButton";
                closeVariantsMenu.title = "Close";
                closeVariantsMenu.onclick = () => {
                    variantsMenu.style.display = "none";
                };

                variantsMenu.append(closeVariantsMenu);

                let variantElements = "<div>";

                variants.forEach((variant) => {
                    variantElements += `
<h2 class="${HOLONEXT_VARIANT_APPLIED_MESH_TITLE_CLASS}">
    ${variant.variantTitle || ""}
  </h2>`;
                    // find if the variant mesh selected

                    let selectedVariant;
                    const appliedMesh = variant.appliedMesh.meshName;

                    selectedVariants.forEach((selectedVariantUnit) => {
                        if (
                            variant.appliedMesh.meshName ===
                            selectedVariantUnit.appliedMeshName
                        ) {
                            selectedVariant = selectedVariantUnit.variantMeshName;
                            window.__holonext__selectedVariants[
                                selectedVariantUnit.appliedMeshName
                                ] = selectedVariantUnit.variantMeshName;
                        }
                    });

                    // if (selectedVariantGroup) {
                    //   selectedVariants.forEach(selectedVariantUnit => {
                    //     if (
                    //       selectedVariantUnit.appliedMeshName ===
                    //       selectedVariantGroup.appliedMesh.meshName
                    //     ) {
                    //       selectedVariant = selectedVariantUnit.variantMeshName;
                    //     }
                    //   });
                    // }

                    // create variant selector function for all variant meshes
                    variant.variantMeshes.forEach((variantMesh) => {
                        window.__holonext__variantSelectors[
                        appliedMesh + "_" + variantMesh.meshName
                            ] = () => {
                            // hide all variants
                            const meshesToHide = [];
                            variant.variantMeshes.forEach((variantMesh2) => {
                                meshesToHide.push(variantMesh2.meshName);
                            });
                            this.applyVariant({
                                meshesToHide,
                                meshToShow: variantMesh.meshName,
                            });

                            window.__holonext__selectedVariants[appliedMesh] =
                                variantMesh.meshName;

                            // apply variant to ar links
                            let currentVariantIndex = null;

                            function arrayCompare(_arr1, _arr2) {
                                if (!Array.isArray(_arr1) ||
                                    !Array.isArray(_arr2) ||
                                    _arr1.length !== _arr2.length
                                ) {
                                    return false;
                                }

                                // .concat() to not mutate arguments
                                const arr1 = _arr1.concat().sort();
                                const arr2 = _arr2.concat().sort();

                                for (let i = 0; i < arr1.length; i++) {
                                    if (arr1[i] !== arr2[i]) {
                                        return false;
                                    }
                                }

                                return true;
                            }
                            variantIndexes.forEach((variantIndex) => {
                                if (
                                    arrayCompare(
                                        variantIndex.selectedVariants,
                                        Object.entries(window.__holonext__selectedVariants).map(
                                            (entry) => entry[1]
                                        )
                                    )
                                ) {
                                    currentVariantIndex = variantIndex.index;
                                }
                            });
                            const arButton = this.shadowRoot.querySelector(".arButton");
                            const Host = `https://holonext.azurewebsites.net/api/v1/scene/variantFile/${this.shadowRoot.host.getAttribute(
                                "sceneid"
                            )}/`;
                            if (this.isIOS()) {
                                arButton.href = `${Host}${currentVariantIndex}.usdz`;
                            } else if (this.isAndroid()) {
                                arButton.href = `${Host}${currentVariantIndex}.glb`;
                            } else {
                                const sceneId = this.shadowRoot.host.getAttribute("sceneId");
                                const arAutoRedirectLink = `https://holonext.azurewebsites.net/public/qr.html?id=${sceneId}&link=${encodeURIComponent(
                                    currentVariantIndex
                                )}`;

                                this.shadowRoot.getElementById("qrCode").innerHTML = "";
                                new QRCode(this.shadowRoot.getElementById("qrCode"), {
                                    text: arAutoRedirectLink,
                                    width: 250,
                                    height: 250,
                                    colorDark: "#000000",
                                    colorLight: "#ffffff",
                                    correctLevel: QRCode.CorrectLevel.H,
                                });
                            }

                            variant.variantMeshes.forEach((variantMesh2) => {
                                var variantMeshComponent = this.shadowRoot.querySelector(
                                    '[data-variant-mesh-id="' +
                                    variantMesh2._id +
                                    '"][class="' +
                                    HOLONEXT_VARIANT_MESH_CONTAINER_CLASS +
                                    '"]'
                                );

                                if (variantMeshComponent) {
                                    // if this is selected
                                    if (variantMesh.meshName === variantMesh2.meshName) {
                                        const newSelectedText = document.createElement("div");
                                        newSelectedText.className =
                                            "holonext-variant-mesh-selected-text";
                                        newSelectedText.innerText = "Selected";
                                        variantMeshComponent.replaceChild(
                                            newSelectedText,
                                            variantMeshComponent.children[1]
                                        );
                                    } else {
                                        const newSelectButton = document.createElement("div");
                                        newSelectButton.className =
                                            HOLONEXT_VARIANT_MESH_SELECT_BUTTON_CLASS;
                                        newSelectButton.onclick = function() {
                                            window.__holonext__variantSelectors[
                                            variant.appliedMesh.meshName +
                                            "_" +
                                            variantMesh2.meshName
                                                ]();
                                        };
                                        newSelectButton.innerText = "Apply";
                                        variantMeshComponent.replaceChild(
                                            newSelectButton,
                                            variantMeshComponent.children[1]
                                        );
                                    }
                                }
                            });
                        };

                        variantElements += `
  <div class="${HOLONEXT_VARIANT_MESH_CONTAINER_CLASS}" data-variant-mesh-id="${variantMesh._id
                        }">
    <div class="${HOLONEXT_VARIANT_MESH_TITLE_CLASS}" title="${variantMesh.variantName
                        }">
      ${variantMesh.color
                            ? `
        <div data-variant-mesh-id="${variantMesh._id}" class="${HOLONEXT_VARIANT_MESH_COLOR_PREVIEW_CLASS}"></div>
      `
                            : " "
                        }
      ${variantMesh.variantName.length > 9
                            ? variantMesh.variantName.slice(0, 8) + "..."
                            : variantMesh.variantName
                        }
    </div>
    ${window.__holonext__selectedVariants[appliedMesh] === variantMesh.meshName
                            ? '<div class="holonext-variant-mesh-selected-text">Selected</div>'
                            : `
      <div class="${HOLONEXT_VARIANT_MESH_SELECT_BUTTON_CLASS}"
        onclick="window.__holonext__variantSelectors['${appliedMesh}_${variantMesh.meshName}']()">
        Apply
      </div>
    `
                        }
  </div>
  `;
                    });
                });

                variantElements += "</div>";

                // VARIANTS CONTAINER
                var holonextVariantsContainer = document.createElement("div");
                holonextVariantsContainer.className = HOLONEXT_VARIANTS_CONTAINER_CLASS;

                variantsMenu.append(holonextVariantsContainer);
                holonextVariantsContainer.innerHTML = `<div class="${HOLONEXT_DROPDOWN_CONTAINER_CLASS}">
<div class="${HOLONEXT_DROPDOWN_CONTENT_CLASS}">
${variantElements}
</div>
</div>`;

                // inject colors to color preview components
                variants.forEach((variant) => {
                    variant.variantMeshes.forEach((variantMesh) => {
                        if (variantMesh.color) {
                            var variantMeshPreviewColorComponent =
                                this.shadowRoot.querySelector(
                                    '[data-variant-mesh-id="' +
                                    variantMesh._id +
                                    '"][class="' +
                                    HOLONEXT_VARIANT_MESH_COLOR_PREVIEW_CLASS +
                                    '"]'
                                );
                            if (variantMeshPreviewColorComponent) {
                                variantMeshPreviewColorComponent.style.background = `rgb(${variantMesh.color.r},${variantMesh.color.g},${variantMesh.color.b})`;
                            }
                        }
                    });
                });

                // select initial variants
                Object.entries(window.__holonext__selectedVariants).forEach(
                    (selectedVariant) => {
                        if (
                            window.__holonext__variantSelectors[
                            selectedVariant[0] + "_" + selectedVariant[1]
                                ]
                        ) {
                            window.__holonext__variantSelectors[
                            selectedVariant[0] + "_" + selectedVariant[1]
                                ]();
                        }
                    }
                );
            }
        }

        initiateArButton() {
            const arButtonContainer = document.createElement("a");
            arButtonContainer.setAttribute("class", "arButton");
            this.shadowRoot.append(arButtonContainer);
            const modalContainer = document.createElement("div");
            const modalContent = document.createElement("div");
            const modalDescriptionOne = document.createElement("div");
            modalDescriptionOne.setAttribute("class", "text-style");
            const modalDescriptionTwo = document.createElement("div");
            modalDescriptionTwo.setAttribute("class", "text-style");
            const modalDescriptionThree = document.createElement("div");
            modalDescriptionThree.setAttribute("class", "text-style mb-10");
            modalContent.setAttribute("class", "modal");
            modalContainer.setAttribute("class", "modal-bg");
            modalContainer.appendChild(modalContent);
            const qrButtonContainer = document.createElement("div");
            //const titleText = document.createElement("h2");
            //const titleDescription = document.createTextNode("HoloNext AR Viewer");
            const qrDescription = document.createTextNode(
                "Scan the QR code for view"
            );
            const qrDescriptionOne = document.createTextNode(
                "the object in Augmented Reality"
            );
            const qrDescriptionTwo = document.createTextNode(
                "You do not need any other app required!"
            );

            //titleDescription.appendChild(titleText);
            //modalTitle.appendChild(titleDescription);
            const modalCloseText = document.createTextNode("Close");
            const modalClose = document.createElement("div");
            modalClose.setAttribute("class", "btn text-style");
            modalClose.appendChild(modalCloseText);
            modalDescriptionOne.appendChild(qrDescription);
            modalDescriptionTwo.appendChild(qrDescriptionOne);
            modalDescriptionThree.appendChild(qrDescriptionTwo);
            modalContent.appendChild(modalDescriptionOne);
            modalContent.appendChild(modalDescriptionTwo);
            modalContent.appendChild(modalDescriptionThree);
            //qrButtonContainer.setAttribute("class","arButton");
            qrButtonContainer.setAttribute("id", "qrCode");
            qrButtonContainer.setAttribute("class", "text-style mb-10");
            modalContent.appendChild(qrButtonContainer);
            modalContent.appendChild(modalClose);
            this.shadowRoot.append(modalContainer);

            const arButtonImage = document.createElement("img");
            arButtonImage.setAttribute("class", "arButtonImage");
            arButtonImage.setAttribute(
                "src",
                "https://holonext.azurewebsites.net/public/images/ar.svg"
            );
            const mobileImage = this.shadowRoot.getElementById("imgRender");
            const arCanvas = this.shadowRoot.getElementById("holonextRenderTarget");
            const progressBar = this.shadowRoot.getElementById(
                "progress-bar-wrapper"
            );
            const arButtonText = document.createTextNode("View In Your Space");

            const quicklookLink = this.shadowRoot.getElementById("quicklookTrigger");

            this.fetchAndCreateScene({ arButtonContainer }).then(
                ({ jsonResponse }) => {
                    // mobileImage.setAttribute("class", "bg-active");
                    // const emptyImg = document.createElement("img");
                    // quicklookLink.appendChild(emptyImg);

                    if (this.isIOS()) {
                        const thumbnailUrl = jsonResponse.body.thumbnail;
                        arButtonContainer.href = jsonResponse.body.usdzModel;
                        arButtonContainer.rel = "ar";
                        arButtonContainer.append(arButtonImage);
                        arCanvas.setAttribute("class", "bg-deactive");
                        arButtonContainer.setAttribute("class", "arButtonImageOnly");
                        progressBar.setAttribute("class", "bg-deactive");
                        mobileImage.setAttribute("class", "bg-active");
                        const emptyImg = document.createElement("img");
                        quicklookLink.appendChild(emptyImg);
                        quicklookLink.setAttribute("href", jsonResponse.body.usdzModel);
                        quicklookLink.setAttribute("rel", "ar");
                        mobileImage.addEventListener("load", clickIosLink)
                        mobileImage.addEventListener("click", function () {
                            mobileImage.parentNode.getElementById("quicklookTrigger").click();
                        });
                        mobileImage.src = jsonResponse.body.thumbnail;
                    } else if (this.isAndroid()) {
                        // TODO ADD LINK AND TITLE FETCHED FROM API TO INTENT
                        // DONT REMOVE THESE + PUSHED TO SOLVE CONFLICTS
                        // const Host = "https://holonext.azurewebsites.net";
                        // const viewerUri = "/api/v1/scene/holonextViewer/";
                        // const sceneId = this.shadowRoot.host.getAttribute("sceneId");
                        // const viewerUrl = Host + viewerUri + sceneId;
                        // arButtonContainer.href = `intent://arvr.google.com/scene-viewer/1.0?file=${jsonResponse.body.glbModel}&mode=ar_preferred&title=${jsonResponse.body.title}&link=${jsonResponse.body.link}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${viewerUrl};end;`;
                        const intentLink = `intent://arvr.google.com/scene-viewer/1.0?file=${jsonResponse.body.glbModel
                        }&mode=ar_preferred&title=${jsonResponse.body.title}${jsonResponse.body.sound ? `&sound=${jsonResponse.body.sound}` : ""
                        }#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;

                        const thumbnailUrl = jsonResponse.body.thumbnail;
                        if (thumbnailUrl == undefined) {
                            thumbnailUrl =
                                "https://holonext.azurewebsites.net/public/images/holonextlogo.jpg";
                        }
                        arButtonContainer.href = intentLink;
                        arButtonContainer.append(arButtonImage);
                        arButtonContainer.setAttribute("class", "arButtonImageOnly");
                        arCanvas.setAttribute("class", "bg-deactive");
                        progressBar.setAttribute("class", "bg-deactive");
                        mobileImage.setAttribute("class", "bg-active");
                        mobileImage.setAttribute("href", intentLink);
                        const emptyImg = document.createElement("img");
                        quicklookLink.appendChild(emptyImg);
                        quicklookLink.setAttribute("href", intentLink);
                        quicklookLink.setAttribute("rel", "ar");
                        mobileImage.addEventListener("load", clickIosLink)
                        mobileImage.addEventListener("click", function () {
                            mobileImage.parentNode.getElementById("quicklookTrigger").click();
                        });
                        mobileImage.src = jsonResponse.body.thumbnail;

                        //https://holonext.azurewebsites.net/api/v1/scene/public/file/5f79e83a08f1533bc8bd9eb0/viewer_test.glb
                    } else {
                        var modalBg = this.shadowRoot.querySelector(".modal-bg");
                        var modalClose = this.shadowRoot.querySelector(".btn");
                        var bBox = this.shadowRoot.querySelector(".boundingBox");
                        arButtonContainer.addEventListener("click", function () {
                            // bBox.classList.add("bg-deactive");
                            modalBg.classList.add("bg-active");
                        });
                        modalClose.addEventListener("click", function () {
                            modalBg.classList.remove("bg-active");
                            // bBox.classList.remove("bg-deactive");
                        });

                        arButtonContainer.append(arButtonImage);
                        arButtonContainer.append(arButtonText);
                        const sceneId = this.shadowRoot.host.getAttribute("sceneId");
                        const arAutoRedirectLink = `https://holonext.com/arview/?id=${sceneId}`;

                        new QRCode(this.shadowRoot.getElementById("qrCode"), {
                            text: arAutoRedirectLink,
                            width: 250,
                            height: 250,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H,
                        });
                    }
                }
            );
        }

        isIOS() {
            return (
                [
                    "iPad Simulator",
                    "iPhone Simulator",
                    "iPod Simulator",
                    "iPad",
                    "iPhone",
                    "iPod",
                ].includes(navigator.platform) ||
                // iPad on iOS 13 detection
                (navigator.userAgent.includes("Mac") && "ontouchend" in document)
            );
        }

        isAndroid() {
            return /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
        }

        fetchAndCreateScene({ arButtonContainer }) {
            // const Host = "http://localhost:5000";
            const Host = "https://holonext.azurewebsites.net";
            const apiUri = "/api/v1/scene/checkModelWithSceneId";
            const sceneId = this.shadowRoot.host.getAttribute("sceneId");
            const data = { sceneId: sceneId };
            return fetch(Host + apiUri, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    return this.fetchVariantData({
                        sceneId,
                    }).then(({ variants, selectedVariants, variantIndexes }) => {
                        this.createBabylonScene({
                            jsonResponse,
                            variants,
                            selectedVariants,
                            arButtonContainer,
                            variantIndexes,
                        });
                        return { jsonResponse, variants, selectedVariants };
                    });

                    //   setTimeout(() => this.createBabylonScene({ jsonResponse }), 5000);
                    //trigger loader
                    //   this.attributeChangedCallback(
                    //     "src",
                    //     null,
                    //     jsonResponse.body.glbModel
                    //   );
                })
                .catch((err) => console.log(err));
        }
        createLabel({
                        titleContent,
                        titleMeshName,
                        textContent,
                        annotationCoordinates,
                        advancedTexture,
                        scene,
                        annotationCamera,
                        index,
                    }) {
            scene.activeCamera._useAutoRotationBehavior = false;
            const fakeMesh = BABYLON.Mesh.CreateSphere(
                titleMeshName + "-fake-mesh",
                0.1,
                1,
                scene
            );
            var sphereMaterial = new BABYLON.StandardMaterial();
            fakeMesh.material = sphereMaterial;
            fakeMesh.position.x = annotationCoordinates.x;
            fakeMesh.position.y = annotationCoordinates.y;
            fakeMesh.position.z = annotationCoordinates.z * -1;

            fakeMesh.isVisible = false;

            const counterText = index + "";

            const label = new BABYLON.GUI.Ellipse(titleMeshName);
            label.background = "black";
            label.height = "30px";
            label.alpha = 1;
            label.width = `${counterText.length * 30}px`;
            label.cornerRadius = 5;
            label.thickness = 1;
            label.linkOffsetY = 30;
            advancedTexture.addControl(label);

            label.linkWithMesh(fakeMesh);

            const text1 = new BABYLON.GUI.TextBlock();
            text1.text = counterText;
            text1.color = "white";
            label.addControl(text1);

            // const fakeDescriptionMesh = Mesh.CreateSphere(
            //   titleMeshName + "-fake-description-mesh",
            //   0.1,
            //   1,
            //   scene
            // );
            // fakeDescriptionMesh.material = sphereMaterial;
            // fakeDescriptionMesh.position.x = annotationCoordinates.x;
            // fakeDescriptionMesh.position.y = annotationCoordinates.y;
            // fakeDescriptionMesh.position.z = annotationCoordinates.z;

            // fakeDescriptionMesh.isVisible = false;

            const descriptionLabel = new BABYLON.GUI.Rectangle(
                titleMeshName + "-description"
            );
            descriptionLabel.background = "black";
            descriptionLabel.height = "30px";
            descriptionLabel.alpha = 1;
            descriptionLabel.width = `270px`;
            descriptionLabel.cornerRadius = 3;
            descriptionLabel.thickness = 1;
            descriptionLabel.linkOffsetY = 60;
            advancedTexture.addControl(descriptionLabel);

            descriptionLabel.linkWithMesh(fakeMesh);

            const descriptionText = `${titleContent}
      ${textContent}`;

            const text2 = new BABYLON.GUI.TextBlock();
            text2.text = descriptionText;
            text2.color = "white";

            const descriptionHeight =
                Math.floor(descriptionText.length / 25) * 25 + 40;

            descriptionLabel.height = `${descriptionHeight}px`;
            descriptionLabel.linkOffsetY = Math.floor(descriptionHeight / 2) + 50;

            text2.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;

            descriptionLabel.addControl(text2);

            descriptionLabel.isVisible = false;
            window.labelList.push(descriptionLabel)
            // see https://forum.babylonjs.com/t/gui-onpointerdownobservable-only-firing-once/7602/5
            label.isPointerBlocker = true;

            label.onPointerDownObservable.add(() => {
                if (
                    window.holonextLastVisibleDescriptionLabel &&
                    window.holonextLastVisibleDescriptionLabel.name !==
                    descriptionLabel.name
                ) {
                    window.holonextLastVisibleDescriptionLabel.isVisible = false;
                }
                descriptionLabel.isVisible = !descriptionLabel.isVisible;
                if (annotationCamera) {
                    this.moveCamera({ annotationCamera, scene });
                }
                if (descriptionLabel.isVisible) {
                    window.holonextLastVisibleDescriptionLabel = descriptionLabel;
                }
            });
            label.onPointerEnterObservable.add(() => {
                document.getElementsByTagName("body")[0].style.cursor = "pointer";
            });
            label.onPointerOutObservable.add(() => {
                document.getElementsByTagName("body")[0].style.cursor = "auto";
            });
        }

        moveCamera({ annotationCamera, scene }) {
            var alphaAnim = new BABYLON.Animation(
                "alphaAnim",
                "alpha",
                60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            var betaAnim = new BABYLON.Animation(
                "betaAnim",
                "beta",
                60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            var radiusAnim = new BABYLON.Animation(
                "radiusAnim",
                "radius",
                60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            var alphaKeys = [
                { frame: 0, value: scene.activeCamera.alpha },
                { frame: 100, value: annotationCamera.target.alpha * -1 },
            ];
            var betaKeys = [
                { frame: 0, value: scene.activeCamera.beta },
                { frame: 100, value: annotationCamera.target.beta },
            ];
            var radiusKeys = [
                { frame: 0, value: scene.activeCamera.radius },
                { frame: 100, value: annotationCamera.target.radius },
            ];

            alphaAnim.setKeys(alphaKeys);
            betaAnim.setKeys(betaKeys);
            radiusAnim.setKeys(radiusKeys);

            var easingFunction = new BABYLON.QuarticEase();

            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

            // Adding the easing function to the animation
            alphaAnim.setEasingFunction(easingFunction);
            betaAnim.setEasingFunction(easingFunction);
            radiusAnim.setEasingFunction(easingFunction);

            scene.activeCamera.animations.push(alphaAnim);
            scene.activeCamera.animations.push(betaAnim);
            scene.activeCamera.animations.push(radiusAnim);
            // scene.activeCamera.animations.push(positionAnim);

            scene.beginAnimation(scene.activeCamera, 0, 100, false);
        }

        renderAnnotations({ scene, annotations, advancedTexture }) {
            annotations.forEach((annotation, index) => {
                this.createLabel({
                    titleContent: annotation.title.content,
                    titleMeshName: annotation.title.meshName,
                    textContent: annotation.text.content,
                    annotationCoordinates: annotation.coordinates,
                    advancedTexture,
                    scene,
                    annotationCamera: annotation.camera,
                    index: index + 1,
                });
            });
        }

        createBabylonScene({
                               jsonResponse,
                               variants,
                               selectedVariants,
                               arButtonContainer,
                               variantIndexes,
                           }) {
            if (jsonResponse.body && jsonResponse.body.glbModel) {
                // BABYLON.DefaultLoadingScreen.DefaultLogoUrl =
                //   "../images/holonextlogo.svg";
                BABYLON.SceneLoader.ShowLoadingScreen = false;
                var canvas = this.shadowRoot.getElementById("holonextRenderTarget");
                var engine = new BABYLON.Engine(canvas, true);
                var createScene = () => {
                    var scene = new BABYLON.Scene(engine);
                    var camera = new BABYLON.ArcRotateCamera(
                        "Camera",
                        0,
                        0,
                        3,
                        new BABYLON.Vector3(0, 0, 0),
                        scene
                    );
                    // camera.setPosition(new BABYLON.Vector3(0, 0, 2));
                    // // Add lights to the scene
                    // var light1 = new BABYLON.HemisphericLight(
                    //   "light1",
                    //   new BABYLON.Vector3(1, 1, 0),
                    //   scene
                    // );
                    // var light2 = new BABYLON.PointLight(
                    //   "light2",
                    //   new BABYLON.Vector3(0, 1, -1),
                    //   scene
                    // );
                    BABYLON.SceneLoader.Append(
                        jsonResponse.body.glbModel,
                        "",
                        scene,
                        (scene) => {
                            try {
                                var model = scene.meshes[0];
                                model._scaling._x = -1;
                                model._scaling._z = 1;
                                /* var nebula = new BABYLON.CubeTexture("https://www.babylonjs.com/assets/skybox/nebula", scene);
                                nebula.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


                                for(var i =0;i<scene.meshes.length;i++){
                                  scene.meshes[i].reflectionTexture = nebula;
                                }
                                console.log(scene.meshes) */
                                /*scene.createDefaultCamera(true, true, true);
                                var light1 = new BABYLON.HemisphericLight(
                                  "light1",
                                  new BABYLON.Vector3(1, 1, 0),
                                  scene
                                );
                                var light2 = new BABYLON.PointLight(
                                  "light2",
                                  new BABYLON.Vector3(0, 1, -1),
                                  scene
                                );
                                model.rotate(new BABYLON.Vector3(0, 1, 0), 180);
                                var helperCamera = scene.activeCamera;
                                helperCamera.useAutoRotationBehavior = true;
                                helperCamera.autoRotationBehavior.idleRotationSpeed = 0.1;
                                helperCamera.wheelPrecision = 1500;
                                var limit = helperCamera.lowerRadiusLimit
                                helperCamera.upperRadiusLimit = limit * 100;
                                helperCamera.attachControl(canvas, true);
                                var t = 0.0;
                                /*scene.beforeRender = function () {
                                  t += 0.01;
                                  helperCamera.autoRotationBehavior.idleRotationSpeed =
                                    1 * (Math.cos(t) * 0.5 + 0.5);
                                };*/
                                scene.createDefaultCameraOrLight(true, true, true);
                                scene.activeCamera.useAutoRotationBehavior = false;
                                if (!jsonResponse.body.annotations) {
                                    scene.activeCamera.useAutoRotationBehavior = true;
                                }

                                scene.activeCamera.beta -= 0.2;

                                var helperCamera = scene.activeCamera;
                                helperCamera.wheelPrecision = 600;
                                var limit = helperCamera.lowerRadiusLimit;
                                helperCamera.lowerRadiusLimit = limit * 50;
                                helperCamera.upperRadiusLimit = limit * 100;
                                helperCamera.panningDistanceLimit = 50;
                                helperCamera.panningSensibility = 0;
                                //console.log(scene.activeCamera)
                                //console.log(scene.lights)
                                //console.log(scene.lights)

                                scene.lights[0].dispose();
                                var light1 = new BABYLON.DirectionalLight(
                                    "light1",
                                    new BABYLON.Vector3(-2, -3, 1),
                                    scene
                                );
                                //light1.position = new BABYLON.Vector3(6, 9, 3);
                                light1.intensity = 2.9;
                                var light2 = new BABYLON.DirectionalLight(
                                    "light2",
                                    new BABYLON.Vector3(2, -3, 1),
                                    scene
                                );
                                //light2.position = new BABYLON.Vector3(6, 9, 3);
                                light2.intensity = 2.5;
                                var light3 = new BABYLON.DirectionalLight(
                                    "light3",
                                    new BABYLON.Vector3(0, 5, 0),
                                    scene
                                );
                                light3.intensity = 2.5;
                                var light4 = new BABYLON.DirectionalLight(
                                    "light4",
                                    new BABYLON.Vector3(0, 1, 1),
                                    scene
                                );
                                light4.intensity = 2.5;
                                /* var light4 = new BABYLON.DirectionalLight(
                                  "light5",
                                  new BABYLON.Vector3(0, 5, -3),
                                  scene
                                );
                                light4.position = new BABYLON.Vector3(6, 9, 3);
                                light4.intensity = 20.0;
                                var light4 = new BABYLON.DirectionalLight(
                                  "light3",
                                  new BABYLON.Vector3(0, 5, 0),
                                  scene
                                );
                                light4.position = new BABYLON.Vector3(0, -1, 0);
                                light4.intensity = 20.0;
                                var light5 = new BABYLON.DirectionalLight(
                                  "light4",
                                  new BABYLON.Vector3(0, 0, -1),
                                  scene
                                );
                                light5.position = new BABYLON.Vector3(0, 0, -1);
                                light5.intensity = 20.0; */
                                var generator = new BABYLON.ShadowGenerator(512, light3);
                                generator.useBlurExponentialShadowMap = true;
                                generator.getShadowMapForRendering().refreshRate = 0;
                                generator.blurKernel = 32;

                                for (var i = 0; i < scene.meshes.length; i++) {
                                    generator.addShadowCaster(scene.meshes[i]);
                                }

                                var helper = scene.createDefaultEnvironment({
                                    groundShadowLevel: 0.6,
                                    enableGroundMirror: true,
                                });
                                //helper.setMainColor(new BABYLON.Color3.Red())
                                //helper.setMainColor(new BABYLON.Color3.White())
                                helper.setMainColor(new BABYLON.Color4(256, 256, 256));
                                helper.groundMirror.mirrorPlane.d = 10;
                                //var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("https://raw.githubusercontent.com/meloturkmen/3D-object/main/specular_cube.dds", scene);
                                var reflectionTexture = new BABYLON.HDRCubeTexture(
                                    "https://raw.githubusercontent.com/mkaanztrk/tessthdr/main/photo_studio_01_2k.hdr",
                                    scene,
                                    128,
                                    false,
                                    true,
                                    false,
                                    true
                                );
                                //var sphereMtl = new BABYLON.PBRMaterial("sphereMtl", scene);
                                //sphereMtl.reflectionTexture = hdrTexture;
                                //scene.meshes[1].material= sphereMtl
                                //hdrTexture.gammaSpace = false;
                                scene.environmentTexture = reflectionTexture;
                                //scene.environmentTexture = null;

                                //helper.clearColor = new BABYLON.Color3.White();
                                scene.clearColor = new BABYLON.Color3.White();

                                this.initiateVariants({
                                    variants,
                                    selectedVariants,
                                    arButtonContainer,
                                    variantIndexes,
                                });

                                const advancedTexture =
                                    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                                        "holonext-annotations"
                                    );
                                window.holonextAnnotationsAdvancedTexture = advancedTexture;

                                advancedTexture.scaleTo(
                                    canvas.offsetWidth,
                                    canvas.offsetHeight
                                );

                                if (
                                    jsonResponse.body.annotations &&
                                    jsonResponse.body.annotations.length &&
                                    jsonResponse.body.annotations.length > 0
                                ) {
                                    // this.createAnnotationToggleUI();
                                    this.createAnnotationTraverseUI({
                                        annotations: jsonResponse.body.annotations,
                                        scene,
                                    });
                                    this.renderAnnotations({
                                        advancedTexture,
                                        scene,
                                        canvas,
                                        annotations: jsonResponse.body.annotations,
                                    });
                                }
                            } catch (err) {
                                console.log("error!", err);
                            }
                        },
                        (progress) => {
                            const progressBarWrapper = this.shadowRoot.getElementById(
                                "progress-bar-wrapper"
                            );
                            if (progress.loaded / progress.total === 1) {
                                progressBarWrapper.style.display = "none";
                            } else {
                                progressBarWrapper.style.display = "block";
                            }

                            const progressBarFill =
                                this.shadowRoot.getElementById("progress-bar-fill");
                            progressBarFill.style.width =
                                Math.round((progress.loaded / progress.total) * 100) + "%";
                        }
                    );

                    return scene;
                };
                var scene = createScene();

                this.__holonext__babylonScene = scene;
                scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);
                engine.runRenderLoop(function () {
                    scene.render();
                });
                // Watch for browser/canvas resize events
                window.addEventListener("resize", function () {
                    engine.resize();
                });
            }
        }

        async fetchVariantData({ sceneId }) {
            try {
                // const Host = "http://localhost:5000";
                const Host = "https://holonext.azurewebsites.net";

                const apiUri = "/api/v1/scene/public/variantData/";

                const response = await fetch(`${Host}${apiUri}${sceneId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const variants = await response.json();
                return variants;
            } catch (error) {
                console.error("fetchVariantData: ", error);
                return false;
            }
        }

        applyVariant({ meshesToHide, meshToShow }) {
            const scene = this.__holonext__babylonScene;

            meshesToHide.forEach((meshToHide) => {
                const oldVariantMesh = scene.meshes.find(
                    (mesh) => mesh.name === meshToHide
                );
                oldVariantMesh.setEnabled(false);
                oldVariantMesh.material.zOffset = 1;
            });
            const newVariantMesh = scene.meshes.find(
                (mesh) => mesh.name === meshToShow
            );

            newVariantMesh.setEnabled(true);
            newVariantMesh.material.zOffset = 2;
        }
    }

    function defineHolonextViewerComponent() {
        if ("customElements" in window) {
            customElements.define("holonext-viewer", HTMLModelElement);
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        async function (event) {
            try {
                // injectStyles();
                // createDomComponents();
            } catch (error) {
                console.error("DOMContentLoaded: ", error);
            }
        },
        false
    );
})();