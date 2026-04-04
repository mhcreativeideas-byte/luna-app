import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';

export default function CGU() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-10"
    >
      <BackButton />
      <h1 className="font-display text-2xl text-luna-text mb-2">Conditions Générales d'Utilisation</h1>
      <p className="text-xs text-luna-text-hint font-body mb-8">Dernière mise à jour : 4 avril 2026</p>

      <div className="space-y-6 text-sm font-body text-luna-text-body leading-relaxed">

        <Section title="1. Présentation du service">
          <p>
            LUNA est une application web de suivi du cycle menstruel accessible à l'adresse{' '}
            <a href="https://lunawellness.app" className="text-luna-rose underline">lunawellness.app</a>.
            Elle propose des conseils personnalisés en matière de bien-être, d'alimentation, de sport et de sommeil,
            adaptés aux différentes phases du cycle menstruel.
          </p>
          <p className="mt-2">
            LUNA est éditée par MH Creative Ideas.
            Contact : <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a>
          </p>
        </Section>

        <Section title="2. Acceptation des conditions">
          <p>
            En créant un compte sur LUNA, l'utilisatrice accepte sans réserve les présentes Conditions Générales
            d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
          </p>
          <p className="mt-2">
            LUNA se réserve le droit de modifier les présentes CGU à tout moment. Les utilisatrices seront informées
            de toute modification substantielle. La poursuite de l'utilisation du service après modification
            vaut acceptation des nouvelles conditions.
          </p>
        </Section>

        <Section title="3. Inscription et compte utilisateur">
          <p>Pour utiliser LUNA, l'utilisatrice doit :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Être âgée d'au moins 16 ans (ou disposer de l'autorisation d'un représentant légal)</li>
            <li>Créer un compte avec une adresse email valide et un mot de passe sécurisé</li>
            <li>Fournir des informations exactes lors de l'inscription et de l'onboarding</li>
          </ul>
          <p className="mt-2">
            L'utilisatrice est seule responsable de la confidentialité de ses identifiants de connexion.
            Toute activité réalisée depuis son compte est réputée effectuée par elle.
          </p>
          <p className="mt-2">
            L'utilisatrice peut à tout moment supprimer son compte depuis les Paramètres de l'application.
            La suppression entraîne l'effacement définitif et irréversible de toutes les données associées au compte.
          </p>
        </Section>

        <Section title="4. Description du service">
          <p>LUNA offre les fonctionnalités suivantes :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Suivi du cycle menstruel et identification de la phase en cours</li>
            <li>Conseils alimentaires et recettes adaptées à chaque phase</li>
            <li>Suggestions d'activités sportives personnalisées</li>
            <li>Conseils sommeil et bien-être</li>
            <li>Journal de bord personnel</li>
            <li>Assistant conversationnel (LUNA Chat)</li>
            <li>Calendrier de suivi</li>
            <li>Gestion de liste de courses (Mon Frigo)</li>
          </ul>
          <p className="mt-2">
            LUNA se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service
            à tout moment, avec ou sans préavis, sans que cela n'ouvre droit à une quelconque indemnisation.
          </p>
        </Section>

        <Section title="5. Avertissement médical">
          <p className="font-semibold text-luna-text">
            ⚠️ LUNA ne constitue en aucun cas un dispositif médical, un outil de diagnostic ou un substitut
            à un avis médical professionnel.
          </p>
          <p className="mt-2">
            Les informations et conseils fournis par LUNA (alimentation, sport, sommeil, bien-être) sont
            donnés à titre purement informatif et éducatif. Ils ne sauraient remplacer une consultation
            médicale, un diagnostic ou un traitement prescrit par un professionnel de santé.
          </p>
          <p className="mt-2">
            L'utilisatrice est invitée à consulter un médecin ou un professionnel de santé qualifié pour
            toute question relative à sa santé, notamment en cas de troubles du cycle, de grossesse,
            de pathologie gynécologique ou de tout autre problème de santé.
          </p>
          <p className="mt-2">
            LUNA ne saurait être tenue responsable des décisions prises par l'utilisatrice sur la base
            des informations fournies par l'application.
          </p>
          <p className="mt-2">
            LUNA ne doit pas être utilisée comme méthode de contraception.
          </p>
        </Section>

        <Section title="6. Données personnelles">
          <p>Dans le cadre de l'utilisation du service, LUNA collecte les données suivantes :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Données d'identification :</strong> prénom, adresse email</li>
            <li><strong>Données de cycle :</strong> date des dernières règles, durée du cycle, durée des règles</li>
            <li><strong>Données de préférences :</strong> objectifs bien-être, niveau sportif, préférences alimentaires, allergies, niveau de cuisine, temps de cuisine</li>
            <li><strong>Données d'utilisation :</strong> journal de bord, sessions sportives, check-ins quotidiens</li>
          </ul>
          <p className="mt-2">
            Ces données sont stockées de manière sécurisée sur les serveurs de Supabase (hébergement conforme au RGPD).
            Elles sont utilisées exclusivement pour le fonctionnement du service et la personnalisation de l'expérience utilisatrice.
          </p>
          <p className="mt-2 font-semibold">
            LUNA ne vend, ne loue et ne partage jamais les données personnelles de ses utilisatrices
            avec des tiers à des fins commerciales ou publicitaires.
          </p>
          <p className="mt-2">
            Pour plus de détails, consultez notre Politique de Confidentialité.
          </p>
        </Section>

        <Section title="7. Droits de l'utilisatrice (RGPD)">
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, l'utilisatrice dispose des droits suivants :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Droit d'accès :</strong> obtenir une copie de ses données personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger ses données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de ses données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir ses données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> s'opposer au traitement de ses données</li>
            <li><strong>Droit à la limitation :</strong> demander la limitation du traitement</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous à :{' '}
            <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a>
          </p>
          <p className="mt-2">
            En cas de litige, l'utilisatrice peut introduire une réclamation auprès de la CNIL
            (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" className="text-luna-rose underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
          </p>
        </Section>

        <Section title="8. Cookies et stockage local">
          <p>
            LUNA utilise le stockage local du navigateur (localStorage) pour sauvegarder les préférences
            de l'utilisatrice et améliorer l'expérience d'utilisation. Aucun cookie de traçage publicitaire
            n'est utilisé.
          </p>
          <p className="mt-2">
            Les données de session sont gérées par Supabase Auth et sont nécessaires au bon fonctionnement
            de l'authentification.
          </p>
        </Section>

        <Section title="9. Propriété intellectuelle">
          <p>
            L'ensemble des contenus présents sur LUNA (textes, conseils, recettes, illustrations, design,
            logo, nom « LUNA », code source) sont la propriété exclusive de MH Creative Ideas et sont
            protégés par le droit de la propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie
            des éléments du service, quel que soit le moyen ou le procédé utilisé, est interdite sans
            l'autorisation écrite préalable de MH Creative Ideas.
          </p>
          <p className="mt-2">
            Toute exploitation non autorisée du service ou de son contenu sera considérée comme constitutive
            d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants
            du Code de la Propriété Intellectuelle.
          </p>
        </Section>

        <Section title="10. Responsabilité">
          <p>
            LUNA s'engage à mettre en œuvre tous les moyens raisonnables pour assurer la disponibilité
            et le bon fonctionnement du service. Toutefois, LUNA ne garantit pas un accès ininterrompu
            ou exempt d'erreurs.
          </p>
          <p className="mt-2">
            LUNA ne saurait être tenue responsable :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Des interruptions temporaires du service pour maintenance ou mise à jour</li>
            <li>Des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser le service</li>
            <li>De l'exactitude des calculs de cycle (chaque femme est unique)</li>
            <li>Des conséquences liées aux conseils fournis (voir article 5 — Avertissement médical)</li>
            <li>De la perte de données due à un cas de force majeure</li>
          </ul>
        </Section>

        <Section title="11. Comportement de l'utilisatrice">
          <p>L'utilisatrice s'engage à :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Utiliser le service de manière conforme à sa destination</li>
            <li>Ne pas tenter de compromettre la sécurité ou le fonctionnement du service</li>
            <li>Ne pas créer de faux comptes ou usurper l'identité d'un tiers</li>
            <li>Ne pas utiliser le service à des fins illicites ou contraires aux bonnes mœurs</li>
          </ul>
          <p className="mt-2">
            En cas de manquement, LUNA se réserve le droit de suspendre ou supprimer le compte
            de l'utilisatrice, sans préavis ni indemnisation.
          </p>
        </Section>

        <Section title="12. Gratuité du service">
          <p>
            L'utilisation de LUNA est actuellement gratuite. LUNA se réserve le droit de proposer
            ultérieurement des fonctionnalités payantes (abonnement premium), sans que cela n'affecte
            l'accès aux fonctionnalités gratuites existantes au moment de l'inscription.
          </p>
        </Section>

        <Section title="13. Liens externes">
          <p>
            LUNA peut contenir des liens vers des sites ou services tiers (Instagram, etc.).
            LUNA n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur
            contenu ou leurs pratiques en matière de protection des données.
          </p>
        </Section>

        <Section title="14. Droit applicable et juridiction">
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'interprétation
            ou l'exécution des présentes, les parties s'efforceront de trouver une solution amiable.
          </p>
          <p className="mt-2">
            À défaut, le litige sera soumis aux tribunaux compétents conformément aux règles de droit commun.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            Pour toute question relative aux présentes CGU ou au fonctionnement de LUNA, contactez-nous :
          </p>
          <ul className="list-none mt-2 space-y-1">
            <li>📧 Email : <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a></li>
            <li>📸 Instagram : <a href="https://www.instagram.com/luna.cyclesfood/" className="text-luna-rose underline" target="_blank" rel="noopener noreferrer">@luna.cyclesfood</a></li>
            <li>🌐 Site : <a href="https://lunawellness.app" className="text-luna-rose underline">lunawellness.app</a></li>
          </ul>
        </Section>

      </div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
      <h2 className="font-display text-base text-luna-text mb-3">{title}</h2>
      <div className="text-sm font-body text-luna-text-body leading-relaxed">{children}</div>
    </div>
  );
}
