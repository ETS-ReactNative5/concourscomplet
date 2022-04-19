import React, {useEffect, useState} from 'react';
import i18n from 'i18next';
import moment from 'moment';
import {SafeAreaView, View} from 'react-native';
import {
  getAllKeys,
  getFile,
  getFiles,
  setFile,
} from '../../utils/myAsyncStorage';
import {
  OpenJson,
  TableCompetition,
  ModalOpenJson,
  ModalChoiceCompetition,
} from '_screens';
import {styleSheet, colors} from '_config';

const Home = props => {
  //Tableau avec toutes les données concours complet
  const [tableData, setTableData] = useState([]);
  //Information de la compétition des concours affichés
  const [competition, setCompetition] = useState({});
  //Liste des compétitions
  const [allCompetitions, setAllCompetitions] = useState([]);

  // Chargement des concours existants
  const getAllSeries = async tab => {
    const keys = await getAllKeys();
    const series = await addSeriesDataTable(
      keys.filter(key => key.match(/.+\.json/g)),
      tab,
    );
    return series;
  };

  async function refreshData(tab, idComp = null) {
    const competitions = getAllCompetitionsInfo(tab);
    setTableData(tab);
    setAllCompetitions(competitions);
    setCompetition(
      idComp == null
        ? getLastCompetition(competitions)
        : competitions.find(c => c.idCompetition === idComp),
    );
  }

  function initData() {
    const tab = tableData;
    getAllSeries(tab).then(tabSeries => {
      if (tabSeries != null) {
        refreshData(tabSeries);
      }
    });
  }

  // Initialise la liste des concours complets déjà présents
  useEffect(() => {
    initData();
  }, []);

  // Ajoute plusieurs concours
  const addSeriesDataTable = async keys => {
    var res = null;
    if (keys.length > 0) {
      // Récupère les clés/valeurs des concours non chargés
      const listKeyValue = await getFiles(keys);
      if (listKeyValue.length > 0) {
        res = [];
        listKeyValue.forEach(keyValue => res.push(keyValue[1]));
        res.sort((a, b) =>
          JSON.parse(a)._.date > JSON.parse(b)._.date ? 1 : -1,
        );
      }
    }
    return res;
  };

  const getAllCompetitionsInfo = tab => {
    var result = [];
    tab.forEach(compete => {
      // Si la compétition n'est pas déjà présente dans result
      if (
        !result
          .map(a => a?._?.idCompetition)
          .includes(JSON.parse(compete).GuidCompetition)
      ) {
        result.push(getCompetitionInfo(compete));
      }
    });
    return result;
  };

  // Ajoute 1 concours //data is stringify
  const addOneSerieDataTable = async (key, data = null) => {
    var tab = tableData;
    if (key.match(/.+\.json/g)) {
      if (tableData.filter(row => JSON.parse(row)._.id === key).length === 0) {
        if (data == null) {
          data = await getFile(key);
        }
        //Met à jour les données des concours en triant par ordre croissant par date
        getInfoSerie(key, data).then(infos => {
          tab.push(infos);
          tab.sort((a, b) => {
            return JSON.parse(a)._.date > JSON.parse(b)._.date ? 1 : -1;
          });
          refreshData(tab, JSON.parse(infos).GuidCompetition);
        });
      }
    }
  };

  const getImageEpreuve = epreuve => {
    var res = '';
    switch (true) {
      case epreuve.includes('Hauteur'):
        res = 'SautEnHauteur_Dark';
        break;
      case epreuve.includes('Perche'):
        res = 'SautALaPerche_Dark';
        break;
      case epreuve.includes('Longueur'):
        res = 'SautEnLongueur_Dark';
        break;
      case epreuve.includes('Triple saut'):
        res = 'SautEnLongueur_Dark';
        break;
      case epreuve.includes('Poids'):
        res = 'LancerDePoids_Dark';
        break;
      case epreuve.includes('Javelot'):
        res = 'Javelot_Dark';
        break;
      case epreuve.includes('Marteau'):
        res = 'LancerDeMarteau_Dark';
        break;
      case epreuve.includes('Disque'):
        res = 'LancerDeDisque_Dark';
        break;
    }
    return res;
  };

  const getStatusColor = statut => {
    var res = colors.black;
    switch (statut) {
      case i18n.t('common:ready'):
        res = colors.black;
        break;
      case i18n.t('common:in_progress'):
        res = colors.red;
        break;
      case i18n.t('common:finished'):
        res = colors.orange;
        break;
      case i18n.t('common:send_to_elogica'):
        res = colors.green;
        break;
    }
    return res;
  };

  const getInfoSerie = async (key, data) => {
    var infoConcours = JSON.parse(data);
    const dateConcours =
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet
        .LstSerieConcoursComplet[0].DateHeureSerie;
    const epreuve =
      infoConcours.EpreuveConcoursComplet.Nom +
      ' ' +
      infoConcours.EpreuveConcoursComplet.Categorie +
      infoConcours.EpreuveConcoursComplet.Sexe +
      ' / ' +
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet
        .LstSerieConcoursComplet[0].Libelle;
    const statut = i18n.t('common:in_progress');
    infoConcours['_'] = {
      id: key,
      date: dateConcours,
      dateInfo:
        moment(dateConcours.toString(), moment.ISO_8601).format(
          i18n.language === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        ) +
        ' - ' +
        moment(dateConcours, moment.ISO_8601).format('H:mm'),
      epreuve: epreuve,
      imageEpreuve: getImageEpreuve(epreuve),
      statut: statut,
      statutColor: getStatusColor(statut),
    };
    await setFile(key, JSON.stringify(infoConcours));
    return JSON.stringify(infoConcours);
  };

  // Récupère la compétition la plus récente à partir de maintenant
  const getLastCompetition = competitions => {
    var result = null;
    if (competitions.length > 0) {
      competitions.sort((a, b) => {
        a.dateCompetition > b.dateCompetition;
      });
      result = competitions[0];
      const recentC = competitions.filter(a => {
        a.dateCompetition > moment();
      });
      if (recentC.length > 0) {
        result = recentC[0];
      }
    }
    return result;
  };

  const getCompetitionInfo = compete => {
    compete = JSON.parse(compete);
    return {
      idCompetition: compete.GuidCompetition,
      /*idEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].GuidSerie,*/
      dateCompetition: compete.DateDebutCompetition,
      /*dateEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].DateHeureSerie,*/
      nomCompetition: compete.NomCompetition?.toString(),
      lieuCompetition:
        compete.Stade?.toString() != null
          ? compete.Stade?.toString()
          : compete.Lieu?.toString(),
      competitionInfo:
        moment(
          compete.DateDebutCompetition?.toString(),
          moment.ISO_8601,
        ).format(i18n.language === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY') +
        ' - ' +
        compete.NomCompetition,
    };
  };

  const setChoiceCompetition = comp => {
    if (comp !== null && JSON.stringify(comp) !== JSON.stringify({})) {
      if (comp.idCompetition !== undefined) {
        if (comp.idCompetition !== competition?.idCompetition?.toString()) {
          refreshData(tableData, comp.idCompetition);
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={[styleSheet.flex1, styleSheet.backWhite, {padding: 10}]}>
      {tableData.length === 0 && (
        <OpenJson addOneSerieDataTable={addOneSerieDataTable} />
      )}
      {tableData.length > 0 && (
        <>
          <View style={{flexDirection: 'row-reverse'}}>
            <ModalOpenJson addOneSerieDataTable={addOneSerieDataTable} />
            {/* S il y a plusieurs competitions */}
            {allCompetitions.length > 1 && (
              <ModalChoiceCompetition
                competition={competition}
                setChoiceCompetition={setChoiceCompetition}
                allCompetitions={allCompetitions}
              />
            )}
          </View>
          <TableCompetition
            tableData={tableData}
            setTableData={setTableData}
            navigation={props.navigation}
            competition={competition}
            allCompetitions={allCompetitions}
            setCompetition={setCompetition}
            refreshData={refreshData}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
