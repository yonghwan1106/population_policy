// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // AOS 애니메이션 초기화
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // 모바일 메뉴 토글
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 스크롤 진행 표시기
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // 스크롤 진행 표시기가 있는 경우에만 처리
        const scrollBar = document.querySelector('.scroll-progress-bar');
        if (scrollBar) {
            scrollBar.style.width = scrolled + '%';
        }
    });

    // 스티키 헤더
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 50);
        }
    });

    // 출산율 추이 차트
    const birthRateChart = document.getElementById('birthRateChart');
    
    if (birthRateChart) {
        const ctx = birthRateChart.getContext('2d');
        
        // 차트 데이터
        const data = {
            labels: ['2015', '2020', '2023', '2025', '2027', '2030', '2032', '2035'],
            datasets: [
                {
                    label: '합계출산율',
                    data: [1.24, 0.84, 0.72, 0.8, 0.95, 1.2, 1.35, 1.5],
                    borderColor: '#1E40AF',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#1E40AF',
                    pointRadius: 5,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '현재 추세 유지시',
                    data: [1.24, 0.84, 0.72, 0.68, 0.65, 0.6, 0.55, 0.5],
                    borderColor: '#DC2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#DC2626',
                    pointRadius: 4,
                    borderDash: [5, 5],
                    tension: 0.3,
                    fill: true
                }
            ]
        };
        
        // 차트 옵션
        const options = {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Pretendard',
                            size: 14
                        }
                    }
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Pretendard',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Pretendard',
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `합계출산율: ${context.raw}명`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0.4,
                    max: 2.1,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Pretendard'
                        },
                        callback: function(value) {
                            return value + '명';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Pretendard'
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        };
        
        // 차트 생성
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
        
        // 미래 추정치 표시 문구 추가
        const footnote = document.createElement('div');
        footnote.className = 'text-center text-gray-500 text-sm mt-4';
        footnote.textContent = '* 2025년 이후 수치는 정책 시행 시 예상 추정치입니다.';
        birthRateChart.parentNode.appendChild(footnote);
    }
    
    // 통계 카운터 애니메이션
    const counters = document.querySelectorAll('.stat-counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2초 동안 애니메이션
        const steps = 100; // 애니메이션 스텝 수
        const stepValue = target / steps;
        const stepTime = duration / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += stepValue;
            if (current <= target) {
                counter.textContent = Math.ceil(current).toLocaleString();
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // 요소가 뷰포트에 들어왔을 때만 카운터 시작
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // 네비게이션 스크롤 이벤트
    const navLinks = document.querySelectorAll('header a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모바일 메뉴가 열려있으면 닫기
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 헤더 높이 고려
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
