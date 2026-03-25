export const LOCALE_STORAGE_KEY = 'robot-figma-locale'
export const DEFAULT_LOCALE = 'en'

export const localeOptions = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
]

export const appMessages = {
  en: {
    app: {
      loadingLabel: 'Loading Workspace',
      loadingTitle: 'Loading product modules',
    },
    layout: {
      brandName: 'Zhiji',
      nav: {
        home: 'Home',
        marketplace: 'AI Skills',
        simulation: 'Simulation Studio',
        dashboard: 'OS Console',
      },
      logoutTitle: 'Sign out',
      logoutHint: 'Sign out of the current workspace session',
      languageLabel: 'Language',
    },
    login: {
      badge: 'Sign in to enter one workspace',
      title: 'Sign in to one workspace',
      titleAccent: 'Access full product features',
      description:
        'Use one workspace for task orchestration, simulation validation, skill deployment, and runtime monitoring. Sign in to continue configuring and validating your robot workflows.',
      modules: [
        {
          title: 'Embodied AI Workspace',
          desc: 'Generate behavior trees from a single sentence and keep task orchestration in one place.',
        },
        {
          title: 'Simulation Validation Center',
          desc: 'Open the 3D studio after sign-in to inspect task flow, parameters, and runtime state.',
        },
        {
          title: 'Fleet Monitoring Center',
          desc: 'Review robot status, live feeds, logs, and alerts from one control surface.',
        },
      ],
      cardTitle: 'Zhiji Sign In',
      accountTitle: 'Login account',
      accountUser: 'Username: admin',
      accountPassword: 'Password: admin',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      requiredError: 'Enter both username and password before continuing.',
      invalidError: 'Incorrect credentials. Please use the administrator account.',
      submit: 'Enter workspace',
      accessScope: 'Access Scope',
      accessItems: [
        'After sign-in, you can access the home overview, skills marketplace, simulation studio, and OS console.',
        'If you open a protected page before signing in, you will be redirected to this login page.',
      ],
    },
  },
  zh: {
    app: {
      loadingLabel: '正在加载工作区',
      loadingTitle: '正在加载产品模块',
    },
    layout: {
      brandName: 'Zhiji',
      nav: {
        home: '首页',
        marketplace: 'AI 技能市场',
        simulation: '仿真工作室',
        dashboard: 'OS 控制台',
      },
      logoutTitle: '退出登录',
      logoutHint: '退出当前工作区会话',
      languageLabel: '语言',
    },
    login: {
      badge: '登录后进入统一工作区',
      title: '登录统一工作区',
      titleAccent: '访问完整产品能力',
      description:
        '在一个工作区内完成任务编排、仿真验证、技能部署与运行监控。登录后可继续配置并验证你的机器人流程。',
      modules: [
        {
          title: '具身智能工作区',
          desc: '一句话生成行为树，把任务编排集中在同一空间里完成。',
        },
        {
          title: '仿真验证中心',
          desc: '登录后进入 3D Studio，查看任务流程、参数配置与实时状态。',
        },
        {
          title: '机队监控中心',
          desc: '在一个控制界面中查看机器人状态、视频流、日志与告警。',
        },
      ],
      cardTitle: 'Zhiji 登录',
      accountTitle: '登录账号',
      accountUser: '用户名：admin',
      accountPassword: '密码：admin',
      usernameLabel: '用户名',
      usernamePlaceholder: '请输入用户名',
      passwordLabel: '密码',
      passwordPlaceholder: '请输入密码',
      requiredError: '请输入用户名和密码后再继续。',
      invalidError: '账号或密码错误，请使用管理员账号。',
      submit: '进入工作区',
      accessScope: '访问范围',
      accessItems: [
        '登录后可访问首页总览、技能市场、仿真工作室与 OS 控制台。',
        '未登录时打开受保护页面，会自动跳转到当前登录页。',
      ],
    },
  },
  fr: {
    app: {
      loadingLabel: 'Chargement de l’espace',
      loadingTitle: 'Chargement des modules produit',
    },
    layout: {
      brandName: 'Zhiji',
      nav: {
        home: 'Accueil',
        marketplace: 'Compétences IA',
        simulation: 'Studio de simulation',
        dashboard: 'Console OS',
      },
      logoutTitle: 'Se déconnecter',
      logoutHint: 'Quitter la session active de l’espace de travail',
      languageLabel: 'Langue',
    },
    login: {
      badge: 'Connectez-vous pour entrer dans un espace unique',
      title: 'Connectez-vous à un espace unique',
      titleAccent: 'Accédez à toutes les fonctionnalités',
      description:
        'Utilisez un seul espace pour l’orchestration des tâches, la validation en simulation, le déploiement des compétences et la supervision en exploitation. Connectez-vous pour poursuivre la configuration et la validation de vos flux robotiques.',
      modules: [
        {
          title: 'Espace IA embarquée',
          desc: 'Générez des arbres de comportement à partir d’une phrase et centralisez l’orchestration des tâches.',
        },
        {
          title: 'Centre de validation en simulation',
          desc: 'Ouvrez le studio 3D après connexion pour examiner le flux de tâche, les paramètres et l’état d’exécution.',
        },
        {
          title: 'Centre de supervision de flotte',
          desc: 'Consultez l’état des robots, les flux vidéo, les journaux et les alertes depuis une seule interface.',
        },
      ],
      cardTitle: 'Connexion Zhiji',
      accountTitle: 'Compte de connexion',
      accountUser: 'Identifiant : admin',
      accountPassword: 'Mot de passe : admin',
      usernameLabel: 'Identifiant',
      usernamePlaceholder: 'Saisir l’identifiant',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Saisir le mot de passe',
      requiredError: 'Saisissez l’identifiant et le mot de passe avant de continuer.',
      invalidError: 'Identifiant ou mot de passe incorrect. Utilisez le compte administrateur.',
      submit: 'Entrer dans l’espace',
      accessScope: 'Accès',
      accessItems: [
        'Après connexion, vous pouvez accéder à l’accueil, au marché des compétences, au studio de simulation et à la console OS.',
        'Si vous ouvrez une page protégée avant connexion, vous serez redirigé vers cette page.',
      ],
    },
  },
  ru: {
    app: {
      loadingLabel: 'Загрузка рабочего пространства',
      loadingTitle: 'Загрузка модулей продукта',
    },
    layout: {
      brandName: 'Zhiji',
      nav: {
        home: 'Главная',
        marketplace: 'AI-навыки',
        simulation: 'Студия симуляции',
        dashboard: 'OS-консоль',
      },
      logoutTitle: 'Выйти',
      logoutHint: 'Выйти из текущей рабочей сессии',
      languageLabel: 'Язык',
    },
    login: {
      badge: 'Войдите, чтобы открыть единое рабочее пространство',
      title: 'Вход в единое рабочее пространство',
      titleAccent: 'Доступ ко всем возможностям продукта',
      description:
        'Используйте одно пространство для оркестрации задач, проверки в симуляции, развертывания навыков и мониторинга в эксплуатации. Войдите, чтобы продолжить настройку и проверку роботизированных процессов.',
      modules: [
        {
          title: 'Рабочее пространство embodied AI',
          desc: 'Создавайте деревья поведения из одной фразы и держите оркестрацию задач в одном месте.',
        },
        {
          title: 'Центр проверки в симуляции',
          desc: 'После входа откройте 3D-студию, чтобы проверить сценарий задачи, параметры и текущее состояние.',
        },
        {
          title: 'Центр мониторинга флота',
          desc: 'Просматривайте состояние роботов, видеопотоки, журналы и оповещения из единого интерфейса.',
        },
      ],
      cardTitle: 'Вход Zhiji',
      accountTitle: 'Учетные данные',
      accountUser: 'Логин: admin',
      accountPassword: 'Пароль: admin',
      usernameLabel: 'Логин',
      usernamePlaceholder: 'Введите логин',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите пароль',
      requiredError: 'Введите логин и пароль перед продолжением.',
      invalidError: 'Неверный логин или пароль. Используйте учетную запись администратора.',
      submit: 'Войти в рабочее пространство',
      accessScope: 'Область доступа',
      accessItems: [
        'После входа доступны главная страница, маркет навыков, студия симуляции и OS-консоль.',
        'Если открыть защищенную страницу до входа, вы будете перенаправлены на эту страницу авторизации.',
      ],
    },
  },
  de: {
    app: {
      loadingLabel: 'Arbeitsbereich wird geladen',
      loadingTitle: 'Produktmodule werden geladen',
    },
    layout: {
      brandName: 'Zhiji',
      nav: {
        home: 'Start',
        marketplace: 'AI-Skills',
        simulation: 'Simulationsstudio',
        dashboard: 'OS-Konsole',
      },
      logoutTitle: 'Abmelden',
      logoutHint: 'Aktuelle Workspace-Sitzung beenden',
      languageLabel: 'Sprache',
    },
    login: {
      badge: 'Anmelden, um einen gemeinsamen Workspace zu öffnen',
      title: 'In einen gemeinsamen Workspace einloggen',
      titleAccent: 'Alle Produktfunktionen nutzen',
      description:
        'Nutzen Sie einen zentralen Workspace für Aufgabenorchestrierung, Simulationsvalidierung, Skill-Bereitstellung und Laufzeitüberwachung. Melden Sie sich an, um Ihre Roboterabläufe weiter zu konfigurieren und zu prüfen.',
      modules: [
        {
          title: 'Embodied-AI-Workspace',
          desc: 'Erstellen Sie Verhaltensbäume aus einem Satz und bündeln Sie die Aufgabenorchestrierung an einem Ort.',
        },
        {
          title: 'Simulationsvalidierungszentrum',
          desc: 'Öffnen Sie nach der Anmeldung das 3D-Studio, um Ablauf, Parameter und Laufzeitstatus zu prüfen.',
        },
        {
          title: 'Flotten-Monitoringzentrum',
          desc: 'Überwachen Sie Roboterstatus, Videoströme, Protokolle und Warnungen in einer Oberfläche.',
        },
      ],
      cardTitle: 'Zhiji Login',
      accountTitle: 'Anmeldekonto',
      accountUser: 'Benutzername: admin',
      accountPassword: 'Passwort: admin',
      usernameLabel: 'Benutzername',
      usernamePlaceholder: 'Benutzernamen eingeben',
      passwordLabel: 'Passwort',
      passwordPlaceholder: 'Passwort eingeben',
      requiredError: 'Bitte Benutzername und Passwort eingeben.',
      invalidError: 'Falsche Zugangsdaten. Bitte das Administratorkonto verwenden.',
      submit: 'Workspace öffnen',
      accessScope: 'Zugriff',
      accessItems: [
        'Nach der Anmeldung stehen Startseite, Skill-Marketplace, Simulationsstudio und OS-Konsole zur Verfügung.',
        'Wenn Sie vor der Anmeldung eine geschützte Seite öffnen, werden Sie auf diese Login-Seite umgeleitet.',
      ],
    },
  },
}
