document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContent = document.getElementById('mainContent');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const themeToggleBtnHeader = document.getElementById('themeToggleBtnHeader'); 
    const htmlElement = document.documentElement;

    const premiumInfoModal = document.getElementById('premium_info_modal');
    const modalContentWrapper = document.getElementById('modal_content_wrapper');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const DEV_MODE_UNLOCK_ALL = true; 
    let currentActiveSectionId = localStorage.getItem('lastActiveSection') || 'introducao'; 

    function openPremiumModal() {
        if (!premiumInfoModal) return;
        premiumInfoModal.classList.remove('hidden');
        setTimeout(() => {
            modalContentWrapper.classList.remove('scale-95', 'opacity-0');
            modalContentWrapper.classList.add('scale-100', 'opacity-100');
        }, 50);
    }

    function closePremiumModal() {
        if (!premiumInfoModal) return;
        modalContentWrapper.classList.add('scale-95', 'opacity-0');
        modalContentWrapper.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
             premiumInfoModal.classList.add('hidden');
        }, 300);
    }
    
    document.querySelectorAll('.switch-to-modal-btn, #ctaParaPremium').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openPremiumModal();
        });
    });

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closePremiumModal);
    }
    if(premiumInfoModal){
        premiumInfoModal.addEventListener('click', function(e) {
            if (e.target === premiumInfoModal) { 
                closePremiumModal();
            }
        });
    }

    function applyTheme(theme) {
        const iconName = theme === 'dark' ? 'sunny-outline' : 'moon-outline';
        if (themeToggleBtnHeader) { 
            themeToggleBtnHeader.innerHTML = `<ion-icon name="${iconName}"></ion-icon>`;
        }
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    }
    
    function toggleTheme() {
        const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        
        if (currentActiveSectionId) {
            const sectionElement = document.getElementById(currentActiveSectionId);
            if (sectionElement) {
                contentSections.forEach(s => {
                    const isActive = s.id === currentActiveSectionId;
                    s.style.display = isActive ? 'block' : 'none';
                    s.classList.toggle('active', isActive);
                });
            }
        }
    }


    if (themeToggleBtnHeader) {
        themeToggleBtnHeader.addEventListener('click', function(e){
            e.preventDefault(); 
            toggleTheme();
        });
    }

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    const freeSectionsIds = ['introducao', 'capitulo1', 'capitulo2', 'sobrenos']; 

    function showSection(targetId) { 
        if (!DEV_MODE_UNLOCK_ALL && !freeSectionsIds.includes(targetId)) {
            openPremiumModal();
            return; 
        }
        
        currentActiveSectionId = targetId; 
        localStorage.setItem('lastActiveSection', currentActiveSectionId); 

        contentSections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
        
        mainContent.scrollTop = 0; 

        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.target === targetId);
        });
    }
    
    document.querySelectorAll('.switch-section-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.dataset.target;
            showSection(targetId);
        });
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.dataset.target;
            showSection(targetId);
            if (window.innerWidth < 768 && (freeSectionsIds.includes(targetId) || DEV_MODE_UNLOCK_ALL) ) {
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<ion-icon name="menu-outline" class="text-3xl"></ion-icon>';
            }
        });
    });

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = sidebar.classList.contains('-translate-x-full');
        sidebar.classList.toggle('-translate-x-full', !isOpen);
        sidebarOverlay.classList.toggle('hidden', !isOpen);
        mobileMenuBtn.innerHTML = isOpen ? '<ion-icon name="close-outline" class="text-3xl"></ion-icon>' : '<ion-icon name="menu-outline" class="text-3xl"></ion-icon>';
    });

    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
        mobileMenuBtn.innerHTML = '<ion-icon name="menu-outline" class="text-3xl"></ion-icon>';
    });
    
    let sectionToActivateOnInit = localStorage.getItem('lastActiveSection') || 'introducao';
    if (!document.getElementById(sectionToActivateOnInit)) { 
        sectionToActivateOnInit = 'introducao';
    }
    currentActiveSectionId = sectionToActivateOnInit; 
    showSection(sectionToActivateOnInit);
    
});