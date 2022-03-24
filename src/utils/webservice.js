import base64 from 'react-native-base64';
import {getFile, setFile} from '../../utils/myasyncstorage';

export const validateCompetitionCode = async (
  codeCompetition,
  t,
  showMessage,
) => {
  const soapRequest = require('easy-soap-request');
  var res = null;
  var XMLParser = require('react-xml-parser');
  if (codeCompetition != null && codeCompetition != '') {
    const {response} = await soapRequest({
      url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        soapAction:
          'http://tempuri.org/IServiceElogicaDEV/GetFileConcoursComplet',
      },
      xml:
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
            <Body>\
                <GetFileConcoursComplet xmlns="http://tempuri.org/">\
                    <codeFileName>' +
        codeCompetition +
        '</codeFileName>\
                </GetFileConcoursComplet>\
            </Body>\
        </Envelope>',
    }).catch(e => {
      console.error(e);
      showMessage({
        message: t('toast:wrong_code'),
        type: 'danger',
      });
    });
    const {headers, body, statusCode} = response;
    if (statusCode === 200) {
      const xmlResponse = new XMLParser().parseFromString(body);
      const myjson = base64.decode(
        xmlResponse.getElementsByTagName('GetFileConcoursCompletResult')[0]
          .value,
      );
      res = myjson;
    } else {
      showMessage({
        message: t('toast:import_error'),
        type: 'danger',
      });
    }
  } else {
    console.error(t('toast:competition_sheet_empty'));
    showMessage({
      message: t('toast:competition_sheet_empty'),
      type: 'danger',
    });
  }
  return res;
};

export const saveJsonFile = async (fileName, content, t, showMessage) => {
  try {
    var result = false;
    const contentFile = await getFile(fileName);
    if (contentFile != null) {
      showMessage({
        message: t('toast:file_already_exist'),
        type: 'warning',
      });
      //TODO Popup overwrite dans le fichier ?
    } else {
      await setFile(fileName, content);
      result = true;
      showMessage({
        message: t('toast:uploaded_file'),
        type: 'success',
      });
    }
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const sendJson = async fileName => {
  const soapRequest = require('easy-soap-request');
  var result = null;
  const contentFile = await getFile(fileName);
  if (contentFile != null) {
    (async () => {
      const {response} = await soapRequest({
        url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          soapAction:
            'http://tempuri.org/IServiceElogicaDEV/PushFileConcoursCompletFromTablette',
        },
        xml:
          '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
              <Body>\
             <PushFileConcoursCompletFromTablette xmlns="http://tempuri.org/">\
             <json>{"fileName":"' +
          fileName +
          '","fileStream":"' +
          base64.encode(contentFile) +
          '"}</json>\
             </PushFileConcoursCompletFromTablette>\
               </Body>\
      </Envelope>',
      }).catch(e => console.error(e));
      const {headers, body, statusCode} = response;
      if (statusCode === 200) {
        result = true;
      }
    })();
  }
  return result;
};