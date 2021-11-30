import React, {useState} from 'react';
import PageHeader from '@/components/PageHeader';
import { Layout } from 'antd';
import Teleprompter, { TeleprompterController } from '@/components/Teleprompter';
import PageContent from '@/components/PageContent';
import Controller, { ControllerValues } from './components/Controller';
import { debounce } from 'lodash';
import { formatDuration } from '@/util';

export interface LocalPageProps {

}

const LocalPage: React.FC<LocalPageProps> = () => {
  // TODO: 从 localStorage 获取配置
  const [config, setConfig] = useState<ControllerValues>({
    fontSize: 64,
    speed: 50,
    mirror: false,
    showProgress: true
  });

  const [estimateDuration, setEstimateDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [controller, setController] = useState<TeleprompterController | null>(null);

  const onControllerValueChange = debounce((config: ControllerValues) => setConfig(config), 50);

  // TODO: 修复时间显示慢的问题
  const remainingTime = estimateDuration - estimateDuration * progress;
  return <>
    <Layout>
      <PageHeader
        center={<Controller reset={controller ? controller.reset : undefined} initialValues={config} onChange={onControllerValueChange}/>}
        right={<span>-{formatDuration(remainingTime)}</span>}
      />
      <PageContent>
        <Teleprompter
          onEstimatedDurationUpdate={estimateDuration => setEstimateDuration(estimateDuration)}
          onProgress={progress => setProgress(progress)}
          onControllerAvailable={controller => setController(controller)}
          {...config}>
        {`候应引定公区消红将县层，县回铁调教开必量响，习千5孟他复半村明。 精完入式只区长济没组，光何要题头际半电斯，除儿届美林放何关。 当群器备技具消，看各海程资月几，肃但要详。 目可就象上间然张，又交受便力表用，技该事严对赤。 先外该选强许并消发规，委许各济下军引行安，期亲医你盛度告查。

        进证至车大行断七示则，决活风转话局度转平，劳时李置主十思整析。 标律给同达音成，化史听多而，金辰事全坊。 矿如示象合根速定导红加，团集府东-展态例。 会龙速效现命问据理，除节民发事取五，斯飞录求柜否离。

  面示质七装能相儿头原，代色许度研光斗，次次16求伸般从。

  元会位价到府统通该眼，千地步规霸便励美。

  置型领书离办己之年，史华连世按研制才花，者李刷构局管肃。 该全社多青处方都许周，义海前县在真品如联世，是造该识或特个速。

  接局满军集却使完群华机，示率消立组时做者，东且S要积4吨K压。

  毛平作它清细布与将交，光厂这高于切九最图，心方G听V相世约北。 高样厂类开素单，资又正是南铁，然界S且杨西。 亲型样铁始可参山信也派数，情才百及届雨较更但。 算斗家须风积管交装定，龙反历般被正气形积派，却证R询消级识保。 海改走已造提构方，工例权养通声，进装孤芳抄见。

  列必小发眼加程花七料，老中开M枝呈严。 理第素度位采因解，精青领阶见影件，专露第一接声。 江基同事保严标象没经，些干两面状小也九引花，使价T同8奇助听。

  酸即越不决类行处层示示，还边下油她新许主叫取，同时届性报切候吨铁。 多个化精消间专风式达五而，别立积者林布治型广书府，己直承然标信然亲统询。 置知重手候影下好号，去青日格程关些，话此录身而图低。

  只子阶拉报以带要始圆什圆明，织据油照整E贡坊听上细。

  维极内飞果广然小名有，和引件方且速广电且，意节建个呈伯图反。 办力好院发结那达进，的四照真什那十，真效李求刷往火。 约维且看专种般空，只意目种观算时社直，例M问活体花结。 京指九规史类任斯，律号号矿权打证，自孟色十革I。

  如矿此果力，头到争火，展2否。

  采用对二先做九，民论风市权车，离3节究年。 院米达决八机接阶治边声，安级主是调治然热理合，角行真孟美即材打辆凝。 农论之路连手号被前，回层高角按件动，属及9C到1接。 或本同这外手下，才北叫太往价，京D增强。 音场委治手看响热引，非半正毛法品状，现最C眼作磨坚。 酸准解记所政且张江率等，交当见领难了太还战已，只革李求枕金非杆打。

  马文段全治通运极头，京前包示科证即果传，区较相族并如又孤，杜求果孤个记第。 却表现身山属严金往员史，交个声置度阶斗还身正，人济H流们坊成领芳。 带更构美型适有层，决花声然影精特，了5秃受柜口。 标质角构样们连那最专，主机前飞题车管细发果，从到屈系明情村车。

  运西都增观二之太，酸再节重历严包，问-半战历V。

  安备容几治统属自还解机，设劳报个速率可发主十，当气蠢苗吴系音贡长。 准约有名来什马放关这许律了，生层铁不济组认通林起口，般众队录秧资增陕王支该。

  厂红数五必历积，部行导般场，标M口整实。 分但使事九影看道光件，放记约队连更老因矿层，府花届辆该想达丽。 开千样什那近组花公织正大，原进也约识Y美常扯析。 广外又报当给验上斯不得，及千来下状世历族调，上划6例时改林论步。 外青料主展飞，十代位参易，力届及辆。

  华子家好。`}
        </Teleprompter>
      </PageContent>
    </Layout>
  </>;
};

export default LocalPage;
