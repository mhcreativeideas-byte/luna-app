import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';

export default function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-10"
    >
      <BackButton />
      <h1 className="font-display text-2xl text-luna-text mb-2">Politique de Confidentialité</h1>
      <p className="text-xs text-luna-text-hint font-body mb-8">Dernière mise à jour : 4 avril 2026</p>

      <div className="space-y-6 text-sm font-body text-luna-text-body leading-relaxed">

        <Section title="1. Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles est MH Creative Ideas,
            éditrice de l'application LUNA, accessible à l'adresse{' '}
            <a href="https://lunawellness.app" className="text-luna-rose underline">lunawellness.app</a>.
          </p>
          <p className="mt-2">
            Contact : <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a>
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p>LUNA collecte les catégories de données suivantes :</p>

          <h3 className="font-semibold text-luna-text mt-3 mb-1">Données fournies par l'utilisatrice :</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prénom</li>
            <li>Adresse email</li>
            <li>Mot de passe (chiffré, jamais stocké en clair)</li>
            <li>Date des dernières règles</li>
            <li>Durée du cycle menstruel</li>
            <li>Durée des règles</li>
            <li>Objectifs bien-être (sport, alimentation, sommeil, etc.)</li>
            <li>Niveau sportif</li>
            <li>Préférences alimentaires et allergies</li>
            <li>Niveau et temps de cuisine</li>
          </ul>

          <h3 className="font-semibold text-luna-text mt-3 mb-1">Données générées par l'utilisation :</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Entrées du journal de bord</li>
            <li>Sessions sportives enregistrées</li>
            <li>Check-ins quotidiens (humeur, énergie, symptômes)</li>
            <li>Conversations avec l'assistant LUNA</li>
            <li>Phase du cycle calculée</li>
            <li>Date de dernière visite</li>
          </ul>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Permettre la création et la gestion du compte utilisatrice</li>
            <li>Calculer la phase du cycle menstruel</li>
            <li>Personnaliser les conseils (alimentation, sport, sommeil, bien-être)</li>
            <li>Proposer des recettes adaptées aux préférences et à la phase du cycle</li>
            <li>Permettre le suivi via le journal et le calendrier</li>
            <li>Améliorer le service et l'expérience utilisatrice</li>
          </ul>
          <p className="mt-3 font-semibold text-luna-text">
            ❌ Les données ne sont JAMAIS utilisées pour :
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>La publicité ciblée</li>
            <li>La revente à des tiers</li>
            <li>Le profilage commercial</li>
            <li>La prise de décision automatisée ayant des effets juridiques</li>
          </ul>
        </Section>

        <Section title="4. Base légale du traitement">
          <p>Le traitement des données repose sur :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Le consentement</strong> de l'utilisatrice (article 6.1.a du RGPD), donné lors de la création du compte</li>
            <li><strong>L'exécution du contrat</strong> (article 6.1.b du RGPD), nécessaire à la fourniture du service</li>
          </ul>
          <p className="mt-2">
            Concernant les données de santé (données de cycle menstruel), le traitement est fondé sur
            le consentement explicite de l'utilisatrice (article 9.2.a du RGPD).
          </p>
        </Section>

        <Section title="5. Hébergement et sécurité des données">
          <p>Les données sont hébergées par :</p>
          <ul className="list-none mt-2 space-y-2">
            <li>
              <strong>Supabase Inc.</strong> — Base de données et authentification
              <br />
              <span className="text-luna-text-hint">Hébergement : AWS (Amazon Web Services), région EU</span>
              <br />
              <span className="text-luna-text-hint">Conformité : SOC 2 Type II, RGPD</span>
            </li>
            <li>
              <strong>Vercel Inc.</strong> — Hébergement de l'application web
              <br />
              <span className="text-luna-text-hint">Conformité : RGPD, Privacy Shield</span>
            </li>
          </ul>
          <p className="mt-3">Mesures de sécurité mises en œuvre :</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Chiffrement des mots de passe (bcrypt)</li>
            <li>Connexion HTTPS/TLS sur l'ensemble du service</li>
            <li>Politiques de sécurité au niveau de la base de données (Row Level Security)</li>
            <li>Authentification sécurisée via Supabase Auth</li>
            <li>Aucun stockage de données de paiement</li>
          </ul>
        </Section>

        <Section title="6. Partage des données">
          <p>
            LUNA ne partage les données personnelles avec aucun tiers, à l'exception des sous-traitants
            techniques nécessaires au fonctionnement du service :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> — Hébergement base de données et authentification</li>
            <li><strong>Vercel</strong> — Hébergement de l'application</li>
            <li><strong>Resend</strong> — Envoi d'emails transactionnels (email de bienvenue)</li>
          </ul>
          <p className="mt-2">
            Ces sous-traitants sont soumis à des obligations de confidentialité et de sécurité conformes au RGPD.
          </p>
        </Section>

        <Section title="7. Durée de conservation">
          <p>Les données sont conservées :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Pendant la durée d'utilisation du compte</strong> — tant que le compte est actif</li>
            <li><strong>Suppression immédiate</strong> — dès que l'utilisatrice supprime son compte, toutes les données sont effacées de manière définitive et irréversible</li>
          </ul>
          <p className="mt-2">
            Aucune donnée n'est conservée après la suppression du compte. Il n'existe aucune sauvegarde
            permettant de restaurer un compte supprimé.
          </p>
        </Section>

        <Section title="8. Droits de l'utilisatrice">
          <p>Conformément au RGPD, l'utilisatrice dispose des droits suivants :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Accès :</strong> obtenir la confirmation que des données sont traitées et en recevoir une copie</li>
            <li><strong>Rectification :</strong> corriger des données inexactes (via les Paramètres de l'app)</li>
            <li><strong>Effacement :</strong> supprimer son compte et toutes les données associées (via les Paramètres)</li>
            <li><strong>Portabilité :</strong> recevoir ses données dans un format lisible</li>
            <li><strong>Opposition :</strong> s'opposer au traitement de ses données</li>
            <li><strong>Limitation :</strong> demander la limitation du traitement</li>
            <li><strong>Retrait du consentement :</strong> retirer son consentement à tout moment</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits :{' '}
            <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a>
          </p>
          <p className="mt-2">
            Délai de réponse : 30 jours maximum à compter de la réception de la demande.
          </p>
        </Section>

        <Section title="9. Cookies et stockage local">
          <p>LUNA utilise :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>localStorage</strong> — pour sauvegarder les préférences locales et améliorer la navigation</li>
            <li><strong>Cookies de session Supabase</strong> — strictement nécessaires à l'authentification</li>
          </ul>
          <p className="mt-2 font-semibold">
            LUNA n'utilise aucun cookie publicitaire, de traçage ou d'analyse comportementale.
          </p>
          <p className="mt-2">
            Aucun outil d'analytics tiers (Google Analytics, Facebook Pixel, etc.) n'est utilisé.
          </p>
        </Section>

        <Section title="10. Mineurs">
          <p>
            LUNA est destinée aux personnes âgées de 16 ans et plus. Les personnes de moins de 16 ans
            doivent obtenir le consentement d'un parent ou représentant légal avant de créer un compte.
          </p>
          <p className="mt-2">
            Si nous apprenons qu'une personne de moins de 16 ans a créé un compte sans consentement parental,
            nous supprimerons ce compte et les données associées dans les meilleurs délais.
          </p>
        </Section>

        <Section title="11. Transferts internationaux">
          <p>
            Les données sont hébergées prioritairement dans l'Union Européenne.
            Certains sous-traitants (Supabase, Vercel) peuvent traiter des données aux États-Unis,
            dans le cadre de garanties appropriées (clauses contractuelles types de la Commission européenne,
            Data Privacy Framework).
          </p>
        </Section>

        <Section title="12. Modification de la politique">
          <p>
            LUNA se réserve le droit de modifier la présente politique de confidentialité.
            En cas de modification substantielle, les utilisatrices seront informées via l'application
            ou par email.
          </p>
        </Section>

        <Section title="13. Contact et réclamation">
          <p>Pour toute question relative à la protection de vos données :</p>
          <ul className="list-none mt-2 space-y-1">
            <li>📧 <a href="mailto:hello@lunawellness.app" className="text-luna-rose underline">hello@lunawellness.app</a></li>
          </ul>
          <p className="mt-2">
            En cas de litige, vous pouvez introduire une réclamation auprès de la CNIL :{' '}
            <a href="https://www.cnil.fr" className="text-luna-rose underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
          </p>
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
