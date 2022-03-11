import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import classNames from 'classnames';
import { action } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { ImgBox } from '~/components/ImgBox';
import { langService } from '~/service/lang';
import { useSetTitle } from '~/utils';
import { useLessThan } from '~/utils/useLessThan';

import { AppBox } from '../../AppBox';
import { lang } from '../../lang';

import './index.local.sass';

const IMAGES = [
  'https://img-cdn.xue.cn/311-app_screen_1_opt.png',
  'https://img-cdn.xue.cn/311-app_screen_2_opt.png',
  'https://img-cdn.xue.cn/311-app_screen_3_opt.png',
  'https://img-cdn.xue.cn/311-app_screen_4_opt.png',
  'https://img-cdn.xue.cn/311-app_screen_5_opt.png',
];

export const HomepageApps = observer(() => {
  const state = useLocalObservable(() => ({
    imageIndex: 0,
    images: IMAGES.map((v, i) => ({ link: v, index: i })),
    timerId: 0,
    dialog: false,
    bigImageLink: '',
  }));
  lang.useLang();
  useSetTitle('Apps & Tools');

  const isMobile = useLessThan(960);

  const handleChangeImage = action((index: number) => {
    state.imageIndex = index;
  });

  const nextSlide = action(() => {
    const newIndex = state.imageIndex === IMAGES.length - 1
      ? 0
      : state.imageIndex + 1;
    state.imageIndex = newIndex;

    state.timerId = window.setTimeout(() => {
      nextSlide();
    }, 2500);
  });

  const handleStopSlide = () => {
    window.clearTimeout(state.timerId);
  };

  const handleResumeSlide = () => {
    handleStopSlide();
    state.timerId = window.setTimeout(() => {
      nextSlide();
    }, 2500);
  };

  const handleShowBigImage = action((link: string) => {
    state.dialog = true;
    state.bigImageLink = link;
  });

  const handleCloseBigImage = action(() => {
    state.dialog = false;
  });

  React.useEffect(() => {
    handleResumeSlide();

    return handleStopSlide;
  }, []);

  if (!lang.ready) {
    return null;
  }

  return (
    <div className="main-box flex-col justify-center items-stretch">
      <div className="flex flex-1 justify-center bg-black bg-opacity-70 px-5 mb:px-0">
        <div
          className={classNames(
            'max-w-[1200px] flex-1 text-14',
            langService.state.lang === 'en' && 'font-consolas',
          )}
        >
          <AppBox />
        </div>
      </div>

      <div
        className={classNames(
          'flex mb:flex-col justify-center max-w-[1260px] w-full mt-10 mb-14 mx-auto',
          'bg-black bg-opacity-70 leading-lang',
          langService.state.lang === 'en' && 'font-consolas',
        )}
      >
        <div className="flex flex-1 mb:flex-col py-8 mb:pt-8 mb:pb-4 pl-12 mb:px-8 min-w-[440px]">
          <div className="flex-1">
            <div className="font-kanit text-main text-20">
              {lang.apps.title}
            </div>

            <div
              className={classNames(
                'mt-2 text-gray-d1',
                langService.state.lang === 'en' && 'font-consolas',
              )}
            >
              {lang.apps.content.map((v, i) => (
                <p className="mt-4" key={i}>{v}</p>
              ))}
            </div>
            <div
              className={classNames(
                'mt-6 text-13 text-gray-7b',
                langService.state.lang === 'en' && 'font-consolas',
              )}
            >
              {lang.apps.smallTip}
            </div>
          </div>
          <div
            className="flex-col mb:flex-row flex-center gap-y-4 gap-x-4 mb:mt-4 px-4"
            onMouseEnter={handleStopSlide}
            onMouseLeave={handleResumeSlide}
          >
            {Array(5).fill(0).map((_, i) => (
              <div
                className="h-6 w-6 flex flex-center cursor-pointer"
                key={i}
                onClick={() => handleChangeImage(i)}
              >
                <div
                  className={classNames(
                    'rounded-full',
                    state.imageIndex === i && 'h-[7px] w-[7px] bg-transparent dot-active',
                    state.imageIndex !== i && 'h-2 w-2 bg-link-soft',
                  )}
                  key={i}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-center flex-none relative overflow-hidden cursor-pointer pc:min-w-[600px]"
          onMouseEnter={handleStopSlide}
          onMouseLeave={handleResumeSlide}
        >
          <div className="relative overflow-hidden">
            <ImgBox
              className="flex-none pc:h-[580px] pc:w-auto mb:w-full mb:h-auto pointer-events-none"
              src={IMAGES[0]}
              alt=""
              width="601"
              height="550"
            />

            {state.images.map((v) => (
              <img
                className="absolute pc:h-[580px] pc:w-auto mb:w-full mb:h-auto duration-300 top-0"
                style={{
                  transform: isMobile
                    ? `translateX(${(v.index - state.imageIndex) * 100}%)`
                    : `translateY(${(v.index - state.imageIndex) * 100}%)`,
                }}
                src={v.link}
                alt=""
                key={v.index}
                onClick={() => handleShowBigImage(v.link)}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={state.dialog}
        onClose={handleCloseBigImage}
        maxWidth="lg"
        disableScrollLock
      >
        <div className="flex flex-center w-full h-full bg-gray-0c relative">
          <div
            className="text-gray-ec text-22 p-4 top-0 right-0 absolute cursor-pointer z-10"
            onClick={handleCloseBigImage}
          >
            <Close />
          </div>

          <img className="w-[100vw] max-w-[900px]" src={state.bigImageLink} alt="" />
        </div>
      </Dialog>
    </div>
  );
});
