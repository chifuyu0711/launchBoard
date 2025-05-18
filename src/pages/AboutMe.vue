
<template>
  <div class="about-me-page">

    <div class="about_me_title">
         <h2 class="page-title">Обо мне</h2>
    </div>
   

    <div class="profile-header">
      <img src="../assets/images/photo.jpg" alt="Фотография профиля" class="profile-photo">
      <div class="profile-details">
        <h1>Саидалихонов Мухторхон</h1>
        <p class="meta-info">20 лет | 11 август 2004 год</p>
        <p class="meta-info">г. Ташкент, Зангиатинский рн.</p>
      </div>
    </div>

    <div class="info-block">
      <h3>Информация</h3>
      <br>
      <p>
        Меня зовут Мухторхон, и я Forntend and Backend-разработчик с опытом создания и оптимизации RESTful API для интернет
        магазинов. Обладаю навыками frontend-разработки на Vue.js,, Composition API, Pinia. Так же знаю Django и Django REST Framework. Опыт проектирования
        баз данных, настройки аутентификации и оптимизации производительности API.  Постоянно совершенствуюсь и
        изучаю новые технологии для эффективной работы над проектами. Ещё хочу изучить TypeScript, React.js Nuxt и много другое
      </p>
      <br>
      <p>
        Когда я не работаю над проектами, мне нравится играть видео игры, такие как CSGO2, Elden Ring, Genshin Impact, Wuthering Waves и др
      </p>
      <br>
      <p>
        Моя цель — создавать качественные и полезные продукты, которые помогают людям решать повседневные задачи и открывают новые возможности. Я всегда открыт для сотрудничества и новых вызовов, ведь каждый проект — это шанс учиться и расти.
      </p>
    </div>
  </div>
</template>


<style scoped lang="scss">
.about-me-page {
    margin: 0;
    padding: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
}
.about_me_title{
    border-bottom: 1px solid #ccc;
    width: 100%;
}

.profile-header img{
width: 200px;
height: 200px;
 border-radius: 50%;
  object-fit: cover;
}
.page-title{
    padding-top: 40px;
    padding-bottom: 20px;
    padding-left: 20px;
}

.profile-header {

  display: flex;
  align-items: center;
  gap: 18px;              
padding: 20px;
}

.meta-info{
    padding:2px;
}

.info-block{
    padding: 20px;
}
</style>
