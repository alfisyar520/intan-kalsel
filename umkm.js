$(document).ready(function(){
    //slider
    fetch(GRAPHQL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: queryGraphqlSliderPerdagangan
        })
    })
    .then(res => res.json())
    .then(data => {
        fetchAllDataSliderPerdagangan = data.data.sliders.nodes
        listSliderPerdagangan()
    })

    //list slider
    function listSliderPerdagangan() {
        fetchAllDataSliderPerdagangan.sort(function (a, b) {
            return a.slider.urutan - b.slider.urutan;
        });
        
        let title = localStorage.getItem('language') == 'id' ? fetchAllDataSliderPerdagangan[fetchAllDataSliderPerdagangan.length - 1].slider.judulSliderIndonesia : fetchAllDataSliderPerdagangan[fetchAllDataSliderPerdagangan.length - 1].slider.judulSliderEnglish
        fetchAllDataSliderPerdagangan.map((item, index) => {
            let active = index == 0 ? 'active':'';
            $(`#carousel-indicator-perdagangan`).append(`
                <button type="button" data-bs-target="#carouselPerdagangan" data-bs-slide-to="${index}" class="${active}" aria-current="true" aria-label="Slide ${index}"></button>
            `);
            $(`#carousel-inner-perdagangan`).append(`
            <div class="carousel-item ${active} carousel-item-home">
                <img src="${item.slider.gambarSlider.sourceUrl}" class="d-block w-100" alt="...">
            </div>
            `);
        })
        $(`#carousel-inner-perdagangan`).append(`
            <div class="caption-header" id="caption-header-perdagangan">
                <p>
                    - ${title}
                </p>
                <div class="elipsis-home">
                    <img src="${BASE_URL}/asset/icon/Hiasan Elipsis.png" style="width:14vw;height:12vw;"/>
                </div>
            </div>
            <div class="button-scroll-down">
                <a href="#list-umkm"><i class="fas fa-angle-down"></i></a>
            </div>
        `)
    }
  //list filter region
  fetch(GRAPHQL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: queryGraphqlMasterCity
        })
    })
    .then(res => res.json())
    .then(data => {
        fetchAllMasterCity = data.data.masterCities.nodes
        listMasterCityOnFilter()
    })
  function listMasterCityOnFilter(){
      fetchAllMasterCity.map((item,index)=>{
        $('#data-city').append(`
        <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <input type="checkbox" class="region-checkbox" id="${item.masterCity.namaKotakabupaten}" name="kota[]" value="${item.masterCity.namaKotakabupaten}">${item.masterCity.namaKotakabupaten}
        </div>`)
      });
  }
    //list all kategori
    fetch(GRAPHQL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: queryGraphqlKategoriPerdagangan
        })
    })
    .then(res => res.json())
    .then(data => {
        fetchAllKategoriPerdagangan= data.data.allKategoriPerdagangan.nodes
        listKategoriChildUMKM()
    })
    function listKategoriChildUMKM(){
    let childUMKM = fetchAllKategoriPerdagangan.filter(data => data.parent !== null)
    let newChildUMKM = childUMKM.filter(data=> data.parent.node.name == "UMKM")
    newChildUMKM.map((item,index)=>{
        let name = item.name.split('/')
        name = localStorage.getItem('language') == 'en' ? name[1] : name[0]
        $('#list-kategori').append(`
            <li class="cas"><a class="dropdown-item kategori-choice" id="${item.slug}">${name}</a></li>
        `)
    })
    
    }

  //end of list parent kategori
  //list all produk
    let filteredParent = []
    fetch(GRAPHQL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: queryGraphqlAllProduk
        })
    })
    .then(res => res.json())
    .then(data => {
        fetchAllProduk= data.data.allProduk.nodes
        listAllProdukUmkm(fetchAllProduk)
    })
    //ini untuk menampilkan data per parent kategori
    $('.parent').click(function(event){
        event.preventDefault();
        $('.parent').removeClass('active');
        $(this).addClass('active');
        let parent = this.id
        let judulPerdagangan = localStorage.getItem('language') == 'id' ? 'Perdagangan Utama' : 'Main Trading'
        let judulUmkm = localStorage.getItem('language') == 'id' ? 'Produk UMKM' : 'Product UMKM'
        if (parent == "kategori-utama"){
            listAllProdukPerdaganganUtama(fetchAllProduk);
            $('#dropdownKategori').hide();
            $('#label-produk').html('').append(`${judulPerdagangan}`);
        }else{
            listAllProdukUmkm(fetchAllProduk);
            $('#dropdownKategori').show();
            $('#label-produk').html('').append(`${judulUmkm}`);
        }
    });
    //ini untuk menampilkan data per kategori UMKM
    function listAllProdukUmkm(data){
        let filteredUmkm = []
        data.map((item,index) => {
            item.allKategoriPerdagangan.nodes.map((itm,idx)=>{
                if (itm.parent !== null && itm.parent.node.name == "UMKM"){
                    filteredUmkm.push(item)
                }
            });

        });
        filteredParent = filteredUmkm;
        if (cekPerdaganganUtama) {
            limitUmkm = 6
        }
        limitUmkmNow = 1
        cekPerdaganganUtama = false
        cekUmkm = true
        showListProduk(filteredUmkm);
    }
    //ini untuk menampilkan data per kategori perdagangan utama
    function listAllProdukPerdaganganUtama(data){
        let filteredUtama= []
        data.map((item,index) => {
            item.allKategoriPerdagangan.nodes.map((itm,idx)=>{
                // console.log(itm);
                if (itm.parent == null && itm.slug == "perdagangan-utama"){
                    filteredUtama.push(item)
                }
            });
            
        });
        filteredParent = filteredUtama
        if (cekUmkm) {
            limitUmkm = 6
        }
        limitUmkmNow = 1
        cekPerdaganganUtama = true
        cekUmkm = false
        showListProduk(filteredUtama);
    }

    //ini untuk menampilkan hasil dari filter kategori pada umkm
    $(document).on('click','.kategori-choice',function(event){
    event.preventDefault();
    let param = this.id
    kategoriFiltered = []
    $('.kategori-choice').removeClass('active');
    $(this).addClass('active');
    if (param !== 'semua'){
        fetchAllProduk.map((item,index) => {
            item.allKategoriPerdagangan.nodes.map((itm,idx)=>{
                if (itm.slug == param){
                    kategoriFiltered.push(item)
                }
            });
            
        });
        limitUmkm = 6
        limitUmkmNow = 1
        showListProduk(kategoriFiltered);
    }else{
        fetchAllProduk.map((item,index) => {
            item.allKategoriPerdagangan.nodes.map((itm,idx)=>{
                if (itm.parent !== null && itm.parent.node.name == "UMKM"){
                    kategoriFiltered.push(item)
                }
            });
            
        });
        limitUmkm = 6
        limitUmkmNow = 1
        showListProduk(kategoriFiltered);
    }
    
    })

    //ini untuk menampilkan hasil dari filter wilayah dan pencarian
    $('.btn-cari').click(function(){
        let selectedRegion = []
        produkfiltered = filteredParent;
        let keyword = $('#search-product').val();
        var boxes = $('.region-checkbox:checkbox:checked').get();
        boxes.map((item,idx)=>{
            selectedRegion.push(item.id);
        })
        if (selectedRegion !== null && selectedRegion.length > 0){
            let produkfiltered2 = produkfiltered.filter(data=> selectedRegion.includes(data.produk.wilayah.masterCity.namaKotakabupaten) );
            produkfiltered = produkfiltered2;
        }
        if (keyword !== '' && keyword !== null){
            let produkfilterdKey = produkfiltered.filter(data=> data.produk.namaProdukUmkm.toLowerCase().indexOf(keyword) !== -1 )
            produkfiltered = produkfilterdKey;
        }
        limitUmkm = 6
        limitUmkmNow = 1
        showListProduk(produkfiltered);
    });

    //ini untuk bisa enter pada field pencarian
    var field_search = document.getElementById('search-product')
    field_search.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            $('.btn-cari').trigger('click');
        }
    });

    //ini FUNGSI UNTUK MENAMPILKAN HTML LIST PRODUK sesuai dengan data yg difilter
    function showListProduk(data){
        $('#list-produk-umkm').html('');
        
        data.map((item,index)=>{
            if (limitUmkmNow <= limitUmkm) {
                
                let srcImg
                if (item.produk.logoProdukUmkm) {
                    srcImg = item.produk.logoProdukUmkm.sourceUrl
                } else {
                    srcImg = `${BASE_URL}/asset/img/emptyImage.jpg`
                }
                $('#list-produk-umkm').append(`
                    <div class="col-lg-4 col-md-6 col-sm-12 box-umkm col-list-umkm">
                        <div class="card-umkm">
                            <a href="${BASE_URL}/Perdagangan/detail_umkm/${item.id}">
                                <img src="${srcImg}" />
                            </a>
                            <div class="card-umkm-footer">
                                <div class="card-umkm-caption">
                                    <a href="${BASE_URL}/Perdagangan/detail_umkm/${item.id}">
                                        <h4><b>${item.produk.namaProdukUmkm}</b></h4>
                                    </a>
                                    <h5>
                                        <span>
                                            <i class="fa fa-map-marker" aria-hidden="true"></i>${item.produk.wilayah.masterCity.namaKotakabupaten}
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            }
            limitUmkmNow += 1
        })
    }

    //end of list all produk
    $('#filter-region').click(function(){

        if ($('.list-region').hasClass("opened")){
            $('.list-region').removeClass('opened').hide('medium');
            $('#icon-filter').removeClass('fa-caret-up').addClass('fa-caret-down')
        }else{
            $('.list-region').addClass('opened').show('medium');
            $('#icon-filter').removeClass('fa-caret-down').addClass('fa-caret-up')
        }
    });

    $('#lihatSelengkapnya').click(function (e) { 
        e.preventDefault();
        if (cekUmkm) {
            limitUmkm += 6
            // if(kategoriFiltered){
            //     alert("kategori masuk")
            //     console.log(kategoriFiltered);
            //     showListProduk(kategoriFiltered);
            // } else {

                listAllProdukUmkm(produkfiltered ? produkfiltered : fetchAllProduk);
            // }
        } else {
            limitUmkm += 6
            listAllProdukPerdaganganUtama(produkfiltered ? produkfiltered : fetchAllProduk);
        }
    });
})
