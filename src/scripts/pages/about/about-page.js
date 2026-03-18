export default class AboutPage {
  async render() {
    return `
      <section class="about-header-section">
        <div class="container text-center">
          <h1 class="about-title">Tentang Aplikasi</h1>
          <p class="about-subtitle">Mengenal lebih dekat platform berbagi cerita ini.</p>
        </div>
      </section>

      <section class="container" style="padding-bottom: 50px;">
        <div class="about-wrapper">
          <div class="about-content">
            <h2>Misi</h2>
            <p>
              Aplikasi Story ini dibangun untuk memberikan ruang yang aman dan nyaman bagi siapa saja 
              untuk berbagi momen, foto, dan cerita inspiratif mereka ke seluruh dunia.
            </p>
          </div>

          <hr class="about-divider">

          <div class="about-developer">
            <h2>Dikembangkan Oleh</h2>
            <div class="developer-card">
              <div class="developer-avatar">
                <i class="fas fa-user-graduate"></i>
              </div>
              <div class="developer-info">
                <h3>Developer Aplikasi</h3>
                <p class="developer-role">Mahasiswa Sistem Informasi</p>
                <p class="developer-univ">Universitas Trunodjoyo Madura</p>
                <p class="developer-bio">
                  Pengembang web yang antusias dalam mengeksplorasi teknologi modern dan 
                  selalu bersemangat membangun antarmuka 
                  yang intuitif dan ramah pengguna.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {}
}
