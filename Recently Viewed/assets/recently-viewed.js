window.Shopify.RecentlyViewed = {};
window.Shopify.RecentlyViewed = {
    getConfig: function () {
        return {
            itemsGrid: parseInt(document.querySelector("[data-section-type='recently-viewed']").getAttribute("data-items-grid")),
            isSlider: document.querySelector("[data-section-type='recently-viewed']").getAttribute("data-slider-enable") == "true"
        };
    },
    recordRecentlyViewed: function () {
        let productHandle = (window.location.pathname.split("/products/")[1]);
        let storage = window.localStorage.getItem("RecentlyViewed");
        storage ? storage = JSON.parse(storage) : storage = [];
        storage.push(productHandle);
        storage = new Set(storage);
        window.localStorage.setItem("RecentlyViewed", JSON.stringify(Array.from(storage)));
    },
    fetchRecentlyViewed: async function () {
        let storage = window.localStorage.getItem("RecentlyViewed");
        if (!document.querySelector("[data-section-type='recently-viewed']") || !storage) {
            document.querySelector("[data-section-type='recently-viewed']").closest(".shopify-section").style.display = "none";
            return
        };
        let promiseArray = [];
        let config = this.getConfig();
        let section = document.querySelector("[data-section-type='recently-viewed']");
        if (storage) {
            storage = JSON.parse(storage);
            for (let product of storage) {
                promiseArray.push(fetch(`${window.Shopify.routes.root}products/${product}?view=recently-viewed`).then(res => res.text()));
            }
        }
        try {
            let allResponses = await Promise.all(promiseArray);
            let frag = document.createDocumentFragment(),
                fetchedContent = document.createElement('div');
            frag.appendChild(fetchedContent);
            for (let product of allResponses) {
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = product;
                if (tempDiv.querySelector(".recently-viewed-item")) {
                    fetchedContent.innerHTML += tempDiv.querySelector(".recently-viewed-item").innerHTML;
                }
            }
            section.querySelector(".js-recently-viewed-list").innerHTML = fetchedContent.innerHTML;
            if (config.isSlider) {
                // Init Slider
            }
        } catch (err) {
            console.log("Something went wrong! ", err);
        };
    }
}